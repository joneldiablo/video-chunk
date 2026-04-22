import { describe, it, expect, mock } from 'bun:test';
import request from 'supertest';
import { startServer } from '../../src/api/server';
import { videoProcessorMock } from '../__mockups__/VideoProcessor.mock';

mock.module('../../src/core/VideoProcessor', () => {
  return {
    VideoProcessor: mock(() => {
      return videoProcessorMock;
    }),
  };
});

describe('Server API', () => {
  it('should return 400 if required parameters are missing in /api/process', async () => {
    const { app, server } = await startServer(0, false);
    const response = await request(app).post('/api/process').send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required parameters');
    
    await new Promise(resolve => server.close(resolve));
  });

  it('should return 200 and results if parameters are correct', async () => {
    const { app, server } = await startServer(0, false);
    const response = await request(app).post('/api/process').send({
      inputPath: 'test.mp4',
      outputDir: './out',
      chunkDuration: 60
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.results).toBeDefined();
    
    await new Promise(resolve => server.close(resolve));
  });
});
