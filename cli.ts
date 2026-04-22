#!/usr/bin/env node
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { VideoService } = require(path.join(__dirname, 'backend', 'src', 'services', 'VideoService.js'));
const { startServer } = require(path.join(__dirname, 'backend', 'src', 'api', 'server.js'));

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'Port for the web server',
      default: Number(process.env.PORT) || 3000,
    })
    .option('frontend', {
      alias: 'f',
      type: 'boolean',
      description: 'Enable the administration frontend',
      default: process.env.ENABLE_FRONTEND === 'true',
    })
    .option('frontend-path', {
      type: 'string',
      description: 'Path to frontend build (env: FRONTEND_PATH)',
      default: process.env.FRONTEND_PATH,
    })
    .command(
      'process',
      'Process a video into chunks',
      (y) => {
        return y
          .option('input', {
            alias: 'i',
            type: 'string',
            description: 'Path to the input video file',
            demandOption: true,
          })
          .option('output', {
            alias: 'o',
            type: 'string',
            description: 'Path to the output directory',
            demandOption: true,
          })
          .option('duration', {
            alias: 'd',
            type: 'number',
            description: 'Duration of each chunk in seconds',
            default: 60,
          });
      },
      async (argv) => {
        const videoService = new VideoService();
        try {
          const results = await videoService.processVideo({
            inputPath: argv.input as string,
            outputDir: argv.output as string,
            chunkDuration: argv.duration as number,
          });
          console.log('Processing complete. Chunks created:');
          results.forEach((r: any) => console.log(`- Chunk ${r.chunkIndex}: ${r.filePath}`));
        } catch (err) {
          console.error('Processing failed:', err);
          process.exit(1);
        }
      }
    )
    .command(
      'server',
      'Start the web server',
      () => {},
      async (argv) => {
        if (argv.frontendPath) {
          process.env.FRONTEND_PATH = argv.frontendPath as string;
        }
        await startServer(argv.port as number, argv.frontend as boolean);
      }
    )
    .help()
    .alias('help', 'h')
    .parse();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
