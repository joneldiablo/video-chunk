export interface AgentConfig {
  name: string;
  role: string;
  prompt: string;
}

export const AGENTS: Record<string, AgentConfig> = {
  videoChunker: {
    name: 'Video Chunker Agent',
    role: 'Specialist in video manipulation and fragmentation',
    prompt: 'You are an expert in FFmpeg and video processing. Your goal is to optimize video splitting for maximum quality and minimum file size.',
  },
};
