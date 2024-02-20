import { log } from './dependencies.ts'
import { assertEquals, assertNotEquals } from './testDependencies.ts';

Deno.test('shorthand', () => {
	log.info('shorthand');
});

Deno.test({
	name: 'equality',
	fn() {
		assertEquals('=', '=');
	}
});

Deno.test({
	name: 'ignore',
	ignore: Deno.build.os === 'windows',
	fn() {
		assertNotEquals('==', '!=');
	}
});

Deno.test({
	name: 'operations',
	sanitizeOps: false,
	fn() {
		setTimeout(log.info, 1000);
	}
});

Deno.test({
	name: 'operations',
	sanitizeResources: false,
	async fn() {
		await Deno.open('mod.ts');
	}
});

Deno.test('metrics & resources', () => {
	console.table(Deno.metrics());
	console.table(Deno.resources());
});