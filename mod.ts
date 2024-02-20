import { Application, send } from 'https://deno.land/x/oak@v5.0.0/mod.ts';

const PORT = 3001;

const server = new Application();

server.use(async (context, next) => {
	await next();

	const responseTime = context.response.headers.get('X-Response-Time');

	console.log(`${context.request.method} ${context.request.url} ${responseTime}`);
});

server.use(async (context, next) => {
	const now = Date.now();

	await next();

	const difference = Date.now() - now;

	context.response.headers.set('X-Response-Time', `${difference}ms`);
});

server.use(async context => {
	const path = context.request.url.pathname;
	const whiteList = ['/index.html', '/favicon.ico', '/style.css', '/script.js'];

	if (whiteList.includes(path)) {
		await send(context, path, {
			root: `${Deno.cwd()}/client`
		});
	};
});

server.use(context => {
	context.response.body = 'Hello, World!';
});

if (import.meta.main) await server.listen({port: PORT});