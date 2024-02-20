import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.60.0/testing/asserts.ts';

Deno.test('shorthand', () => {
	console.log('shorthand');
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
		setTimeout(console.log, 1000);
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