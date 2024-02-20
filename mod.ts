import { Application } from 'https://deno.land/x/oak@v5.0.0/mod.ts';

const PORT = 3001;

const server = new Application();

server.use(context => {
	context.response.body = 'Hello, World!';
});

if (import.meta.main) await server.listen({port: PORT});