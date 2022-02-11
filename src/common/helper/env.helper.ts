import { existsSync } from 'fs';
import { resolve } from 'path';

/*
 * Get path to environment file
 */
export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  let filename: string = 'dev.env';

  if (env !== undefined) {
    filename = `${env}.env`;
  }

  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}
