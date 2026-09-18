import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('=======================================================');
console.log('🚀 Starting CampusOne Platform (Backend & Frontend)...');
console.log('=======================================================');

const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('[Backend Process Error]:', err);
});

frontend.on('error', (err) => {
  console.error('[Frontend Process Error]:', err);
});

const cleanup = () => {
  console.log('\nStopping CampusOne services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
