#!/usr/bin/env node

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const pathFile = process.argv[2];

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.ffprobe(pathFile, (err, metadata) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const duration = metadata.format.duration;
  const chunks = Number(process.argv[3]) || 4;
  const chunkDuration = duration / chunks;
  let tmp = pathFile.split(/[\/\\]/);
  let filename = tmp.pop();
  let pathOut = process.argv[4] || tmp.join('/');
  pathOut = pathOut.endsWith('/') ? pathOut : (pathOut + '/');
  tmp = filename.split('.');
  const ext = '.' + tmp.pop();
  filename = tmp.join('.') + '.';
  let done = 0;
  console.log('working...');
  for (let i = 0; i < chunks; i++) {
    const chunkOut = pathOut + filename + i + ext;
    ffmpeg(pathFile)
      .setStartTime(chunkDuration * i)
      .setDuration(chunkDuration)
      .output(chunkOut)
      .on('end', (err) => {
        if (err) return
        console.log(chunkOut);
        if (++done >= chunks) {
          process.exit();
        }
      })
      .on('error', (err) => {
        console.error('error: ', err);
        process.exit(1);
      }).run();
  }
});