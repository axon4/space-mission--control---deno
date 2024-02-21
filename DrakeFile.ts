import { desc, run, sh, task } from './developmentDependencies.ts';

desc('start');
task('start', [], async () => {
	await sh('PORT=3001 deno run --allow-env --allow-net --allow-read mod.ts');
});

desc('cache & lock dependencies');
task('cache-lock', [], async () => {
	await sh('deno cache --lock=lock.json --lock-write mod.ts DrakeFile.ts');
});

run();