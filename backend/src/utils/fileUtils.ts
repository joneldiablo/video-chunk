import crypto from 'crypto';
import path from 'path';

export function generateJobId() {
  const hash = crypto.randomBytes(4).toString('hex');
  const timestamp = Date.now();
  return `${hash}-${timestamp}`;
}
