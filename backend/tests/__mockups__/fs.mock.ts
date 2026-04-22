import { mock } from 'bun:test';

export const fsMock = {
  mkdir: mock(async (path: string, options: any) => {
    return undefined;
  }),
};
