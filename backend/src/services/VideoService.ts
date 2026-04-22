import { VideoProcessor } from '../core/VideoProcessor';
import { VideoChunkConfig, ChunkResult } from '../models/video';

export class VideoService {
  private processor: VideoProcessor;

  constructor() {
    this.processor = new VideoProcessor();
  }

  async processVideo(config: VideoChunkConfig): Promise<ChunkResult[]> {
    console.log(`Starting video processing for: ${config.inputPath}`);
    try {
      const results = await this.processor.splitVideo(config);
      console.log(`Successfully split video into ${results.length} chunks.`);
      return results;
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  }
}
