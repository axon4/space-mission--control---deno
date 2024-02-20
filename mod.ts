import * as log from 'https://deno.land/std@0.95.0/log/mod.ts';
import { Application, send } from 'https://deno.land/x/oak@v5.0.0/mod.ts';
import router from './router.ts';

const PORT = 3001;

await log.setup({
	loggers: {
		default: {
			level: 'DEBUG',
			handlers: ['console']
		}
	},
	handlers: {
		console: new log.handlers.ConsoleHandler('DEBUG')
	}
});

const server = new Application();

server.use(async (context, next) => {
	await next();

	const responseTime = context.response.headers.get('X-Response-Time');

	log.info(`${context.request.method} ${context.request.url} ${responseTime}`);
});

server.use(async (context, next) => {
	const now = Date.now();

	await next();

	const difference = Date.now() - now;

	context.response.headers.set('X-Response-Time', `${difference}ms`);
});

server.use(router.routes());
server.use(router.allowedMethods());

server.use(async context => {
	const path = context.request.url.pathname;
	const whiteList = ['/index.html', '/favicon.ico', '/style.css', '/script.js'];

	if (whiteList.includes(path)) {
		await send(context, path, {
			root: `${Deno.cwd()}/client`
		});
	};
});

if (import.meta.main) {
	log.info(`server listening on port: ${PORT}`);
	await server.listen({port: PORT});
};