import * as log from 'https://deno.land/std@0.95.0/log/mod.ts';
import { flatMap } from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

interface Launch {
	flightNumber: number;
	launchDate: number;
	mission: string;
	rocket: string;
	target?: string;
	upComing: boolean;
	success?: boolean;
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
			launchDate: launch.launch_date_unix,
			mission: launch.mission_name,
			rocket: launch.rocket.rocket_name,
			upComing: launch.upcoming,
			success: launch.launch_success,
			customers
		};

		launches.set(flightData.flightNumber, flightData);
	};
};

export function getLaunches() {
	return Array.from(launches.values());
};

export function getLaunch(ID: number) {
	if (launches.has(ID)) return launches.get(ID);
	else return undefined;
};

export function scheduleLaunch(launch: Launch) {
	launches.set(launch.flightNumber, Object.assign(launch, {
		upComing: true,
		customers: ['NASA', 'SpaceX']
	}));
};

export function abortLaunch(ID: number) {
	const launch = getLaunch(ID);

	if (launch) {
		launch.upComing = false;
		launch.success = false;
	};

	return launch;
};

await fetchLaunches();
log.info(`fetched ${launches.size} launches`);