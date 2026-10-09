import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('.test-build', {recursive:true});
writeFileSync('.test-build/package.json', '{"type":"commonjs"}');
const result = spawnSync(process.execPath, ['--test','tests/security.test.cjs'], {stdio:'inherit'});
process.exit(result.status ?? 1);
