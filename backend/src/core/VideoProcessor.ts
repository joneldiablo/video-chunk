import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { VideoChunkConfig, ChunkResult } from '../models/video';

export class VideoProcessor {
  async splitVideo(config: VideoChunkConfig): Promise<ChunkResult[]> {
    const { inputPath, outputDir, chunkDuration, format = 'mp4' } = config;

    await fs.mkdir(outputDir, { recursive: true });

    const duration = await this.getVideoDuration(inputPath);
    const totalChunks = Math.ceil(duration / chunkDuration);
    const results: ChunkResult[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const startTime = i * chunkDuration;
      const endTime = Math.min((i + 1) * chunkDuration, duration);
      const outputFileName = `chunk_${i + 1}.${format}`;
      const outputFilePath = path.join(outputDir, outputFileName);

      await this.extractChunk(inputPath, outputFilePath, startTime, chunkDuration);

      results.push({
        chunkIndex: i + 1,
        filePath: outputFilePath,
        startTime,
        endTime,
      });
    }

    return results;
  }

  private async getVideoDuration(inputPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err: Error | null, metadata: any) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 0);
      });
    });
  }

  private async extractChunk(inputPath: string, outputFilePath: string, startTime: number, duration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(outputFilePath)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });
  }
}
