import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { videoProcessorMock } from '../__mockups__/VideoProcessor.mock';

mock.module('../../src/core/VideoProcessor', () => {
  return {
    VideoProcessor: mock(() => {
      return videoProcessorMock;
    }),
  };
});

import { VideoService } from '../../src/services/VideoService';

describe('VideoService', () => {
  let service: VideoService;

  beforeEach(() => {
    service = new VideoService();
  });

  it('should call VideoProcessor.splitVideo and return results', async () => {
    const config = {
      inputPath: 'test.mp4',
      outputDir: './out',
      chunkDuration: 60,
    };

    const results = await service.processVideo(config);

    expect(videoProcessorMock.splitVideo).toHaveBeenCalledWith(config);
    expect(results).toHaveLength(2);
    expect(results[0].chunkIndex).toBe(1);
  });

  it('should throw error when VideoProcessor fails', async () => {
    videoProcessorMock.splitVideo.mockRejectedValueOnce(new Error('Processing error'));

    const config = {
      inputPath: 'test.mp4',
      outputDir: './out',
      chunkDuration: 60,
    };

    await expect(service.processVideo(config)).rejects.toThrow('Processing error');
  });
});
