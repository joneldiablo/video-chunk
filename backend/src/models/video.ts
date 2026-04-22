export interface VideoChunkConfig {
  inputPath: string;
  outputDir: string;
  chunkDuration: number; // in seconds
  format?: string;
}

export interface ChunkResult {
  chunkIndex: number;
  filePath: string;
  startTime: number;
  endTime: number;
}

export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
}
