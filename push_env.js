const fs = require('fs');
const { execSync } = require('child_process');

const lines = fs.readFileSync('.env.local', 'utf8').split('\n');

for (const line of lines) {
  if (!line || line.startsWith('#')) continue;
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    console.log('Adding ' + key);
    try {
      execSync(`npx vercel env add ${key} production`, { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
    } catch(e) {
      console.error('Failed for ' + key);
    }
  }
}
