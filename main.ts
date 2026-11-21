// Hand the offline guide in as a static bundle. Node 22 provides the TypeScript
// execution and filesystem support; the browser app itself needs no build step.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR || '/output';

mkdirSync(destination, { recursive: true });
cpSync(join(repoRoot, 'app'), join(destination, 'app'), { recursive: true });

const screenshotSource = join(repoRoot, 'screenshots');
const screenshotTarget = join(destination, 'screenshots');
mkdirSync(screenshotTarget, { recursive: true });
if (existsSync(screenshotSource)) {
  cpSync(screenshotSource, screenshotTarget, { recursive: true });
}

const dossierLimits = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};
const dossier = buildDossier(destination, dossierLimits);
writeFileSync(join(destination, 'dossier.json'), dossier);
