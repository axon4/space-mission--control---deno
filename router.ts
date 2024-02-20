import { Router } from './dependencies.ts';
import { getPlanets } from './planets.ts';
import { abortLaunch, getLaunch, getLaunches, scheduleLaunch } from './launches.ts';

const router = new Router();

router.get('/', context => {
	context.response.body = `
		:::===  :::====  :::====  :::===== :::=====          :::=======  ::: :::=== 
		:::     :::  === :::  === :::      :::               ::: === === ::: :::    
		=====  =======  ======== ===      ======   ======== === === === ===  ===== 
			=== ===      ===  === ===      ===               ===     === ===     ===
		======  ===      ===  ===  ======= ========          ===     === === ====== 
																					
		:::===  ::: :::====  :::= ===                   :::===== :::====  :::= ===  
		:::     ::: :::  === :::=====                   :::      :::  === :::=====  
		=====  === ===  === ======== ======== ======== ===      ===  === ========  
			=== === ===  === === ====                   ===      ===  === === ====  
		======  ===  ======  ===  ===                    =======  ======  ===  ===  
																					
		:::==== :::====  :::====  :::                                               
		:::==== :::  === :::  === :::                                               
		===   =======  ===  === ===                                               
		===   === ===  ===  === ===                                               
		===   ===  ===  ======  ========                                          
																					
		=== :::====  :::===== :::= === :::====  ===                                
		===  :::  === :::      :::===== :::  ===  ===                               
		===  ===  === ======   ======== ===  ===  ===                               
		===  ===  === ===      === ==== ===  ===  ===                               
		=== =======  ======== ===  ===  ======  ===                                
	`;
});

router.get('/planets', context => {
	context.response.body = getPlanets();
});

router.get('/launches', context => {
	context.response.body = getLaunches();
});

router.get('/launches/:ID', context => {
	if (context.params?.ID) {
		const launch = getLaunch(Number(context.params.ID));

		if (launch) context.response.body = launch;
		else context.throw(404, 'error getting launch');
	};
});

router.post('/launches', async context => {
	const body = (await context.request.body()).value;

	scheduleLaunch(body);

	context.response.status = 201;
	context.response.body = {success: true};
});

router.delete('/launches/:ID', context => {
	if (context.params?.ID) {
		const launch = abortLaunch(Number(context.params.ID));

		context.response.body = {success: launch};
	};
});

export default router;