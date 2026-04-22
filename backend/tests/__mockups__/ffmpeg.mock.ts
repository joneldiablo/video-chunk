import { mock } from 'bun:test';

export const ffmpegMock = {
  ffprobe: mock((path: string, cb: Function) => {
    cb(null, {
      format: { duration: 120 }
    });
  }),
  process: mock((input: string) => {
    const mockInstance = {
      setStartTime: mock(() => mockInstance),
      setDuration: mock(() => mockInstance),
      output: mock(() => mockInstance),
      on: mock((event: string, cb: Function) => {
        if (event === 'end') cb();
        return mockInstance;
      }),
      run: mock(() => {}),
    };
    return mockInstance;
  }),
};

// We can't make the object callable and have properties in TS/JS easily 
// without a proxy or a function.
const ffmpegProxy = Object.assign(ffmpegMock.process, {
  ffprobe: ffmpegMock.ffprobe,
});

export { ffmpegProxy as ffmpegLib };
