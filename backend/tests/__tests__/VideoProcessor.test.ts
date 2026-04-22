import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { ffmpegLib, ffmpegMock } from '../__mockups__/ffmpeg.mock';
import { fsMock } from '../__mockups__/fs.mock';

mock.module('fluent-ffmpeg', () => {
  return {
    default: ffmpegLib,
  };
});

mock.module('node:fs/promises', () => {
  return {
    default: fsMock,
  };
});

mock.module('fs/promises', () => {
  return {
    default: fsMock,
  };
});

describe('VideoProcessor', () => {
  let processor: any;

  beforeEach(() => {
    // Dynamic import to ensure mocks are applied
    import('../../src/core/VideoProcessor').then(m => {
      processor = new m.VideoProcessor();
    });
  });

  it('should split video into correct number of chunks', async () => {
    // Wait for processor to be initialized
    while (!processor) await new Promise(r => setTimeout(r, 10));

    const config = {
      inputPath: 'test.mp4',
      outputDir: './out',
      chunkDuration: 60,
    };

    const results = await processor.splitVideo(config);

    expect(results).toHaveLength(2);
    expect(results[0].chunkIndex).toBe(1);
    expect(results[1].chunkIndex).toBe(2);
    expect(fsMock.mkdir).toHaveBeenCalled();
  });

  it('should handle ffprobe errors', async () => {
    while (!processor) await new Promise(r => setTimeout(r, 10));

    ffmpegMock.ffprobe.mockImplementationOnce((path, cb) => {
      cb(new Error('FFprobe failed'), null);
    });

    const config = {
      inputPath: 'invalid.mp4',
      outputDir: './out',
      chunkDuration: 60,
    };

    await expect(processor.splitVideo(config)).rejects.toThrow('FFprobe failed');
  });
});
