import { mock } from 'bun:test';
import { ChunkResult } from '../../src/models/video';

export const videoProcessorMock = {
  splitVideo: mock(async (config: any): Promise<ChunkResult[]> => {
    return [
      { chunkIndex: 1, filePath: '/tmp/chunk1.mp4', startTime: 0, endTime: 60 },
      { chunkIndex: 2, filePath: '/tmp/chunk2.mp4', startTime: 60, endTime: 120 },
    ];
  }),
};
