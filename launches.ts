import * as log from 'https://deno.land/std@0.95.0/log/mod.ts';
import { flatMap } from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

interface Launch {
	flightNumber: number;
	mission: string;
	rocket: string;
	customers: string[];
};

const launches = new Map<number, Launch>();

async function fetchLaunches() {
	log.info('fetching launches...');

	const response = await fetch('https://api.spacexdata.com/v3/launches', {method: 'GET'});

	if (!response.ok) {
		log.critical('error fetching launch-data');

		throw new Error("error fetching launch-data");
	};

	const data = await response.json();

	for (const launch of data) {
		const payloads = launch.rocket.second_stage.payloads;
		const customers = flatMap(payloads, (payload: any) => payload.customers);
		const flightData = {
			flightNumber: launch.flight_number,
			mission: launch.mission_name,
			rocket: launch.rocket.rocket_name,
			customers
		};

		launches.set(flightData.flightNumber, flightData);

		log.info(JSON.stringify(flightData));
	};
};

if (import.meta.main) {
	await fetchLaunches();

	log.info(`fetched ${launches.size} launches`);
};