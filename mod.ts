import { Application, log, send } from './dependencies.ts';
import router from './router.ts';

const PORT = /* Number(Deno.env.get('PORT')) || */ 3001;

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
log.debug('setting-up logger');

const server = new Application();

server.addEventListener('error', event => {
	log.error(event.error);
});

server.use(async (context, next) => {
	try {
		await next();
	} catch (error) {
		context.throw(500, '500: Internal Server-Error');

		throw error;
	};
});

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
	const whiteList = ['/index.html', '/favicon.ico', '/space.mp4', '/style.css', '/script.js'];

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