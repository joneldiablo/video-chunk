import express from 'express';
import path from 'path';
import multer from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import { VideoService } from '../services/VideoService';
import { VideoChunkConfig } from '../models/video';
import { generateJobId } from '../utils/fileUtils';

const videoService = new VideoService();
const __rootDir = path.join(__dirname, '..');
const __tmpDir = path.join(__rootDir, 'tmp');

fs.mkdir(__tmpDir, { recursive: true }).catch(() => {});

const upload = multer({ dest: __tmpDir });

export async function startServer(port: number, enableFrontend: boolean) {
  const app = express();
  app.use(express.json());

  // Serve tmp files for preview
  app.use('/tmp', express.static(__tmpDir));

  // API endpoints
  app.post('/api/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Fix encoding for filenames with accents (common issue with multipart/form-data)
    const originalName = req.file.originalname;
    const decodedFileName = Buffer.from(originalName, 'latin1').toString('utf8');

    const jobId = generateJobId();
    const ext = path.extname(decodedFileName);
    const finalPath = path.join(__tmpDir, `${jobId}${ext}`);
    
    await fs.rename(req.file.path, finalPath);

    res.json({ 
      success: true, 
      jobId, 
      filePath: `/tmp/${path.basename(finalPath)}`,
      fileName: decodedFileName 
    });
  });

  app.post('/api/process', async (req, res) => {
    const { jobId, filePath, chunkDuration } = req.body;
    if (!jobId || !filePath || !chunkDuration) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const outputDir = path.join(__tmpDir, jobId);
    const absoluteInputPath = path.join(__tmpDir, filePath.replace('/tmp/', ''));

    try {
      const results = await videoService.processVideo({
        inputPath: absoluteInputPath,
        outputDir: outputDir,
        chunkDuration,
      });

      const chunks = results.map(r => ({
        ...r,
        url: `/tmp/${jobId}/${path.basename(r.filePath)}`
      }));

      res.json({ success: true, jobId, chunks });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/download/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const outputDir = path.join(__tmpDir, jobId);

    try {
      const zip = new AdmZip();
      zip.addLocalFolder(outputDir);
      const zipBuffer = zip.toBuffer();

      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', `attachment; filename=${jobId}.zip`);
      res.send(zipBuffer);

      // Cleanup after sending the response
      res.on('finish', async () => {
        try {
          // 1. Remove the chunks folder
          await fs.rm(outputDir, { recursive: true, force: true });

          // 2. Remove the original uploaded file (matches jobId.*)
          const tmpDir = __tmpDir;
          const files = await fs.readdir(tmpDir);
          const filesToDelete = files.filter(file => file.startsWith(jobId) && file !== jobId);
          
          for (const file of filesToDelete) {
            await fs.unlink(path.join(tmpDir, file));
          }
          console.log(`Cleaned up temporary files for job: ${jobId}`);
        } catch (cleanupError) {
          console.error(`Cleanup failed for job ${jobId}:`, cleanupError);
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Could not create ZIP archive' });
    }
  });

  if (enableFrontend) {
    const frontendDist = process.env.FRONTEND_PATH || path.join(__dirname, '..', '..', '..', 'frontend');
    console.log('Serving frontend from:', frontendDist);
    app.use(express.static(frontendDist));
    app.use((req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    if (enableFrontend) {
      console.log('Frontend enabled.');
    } else {
      console.log('Frontend disabled.');
    }
  });

  return { app, server };
}

