import { BufReader, join, log, parse, pick } from './dependencies.ts';

type Planet = Record<string, string>;

export function filterHabitablePlanets(planets: Planet[]) {
	return planets.filter(planet => {
		const stellarRadius = Number(planet.koi_srad);
		const stellarMass = Number(planet.koi_smass);
		const planetaryRadius = Number(planet.koi_prad);

		return planet.koi_disposition === 'CONFIRMED' && stellarRadius > 0.99 && stellarRadius < 1.01 && stellarMass > 0.78 && stellarMass < 1.04 && planetaryRadius > 0.5 && planetaryRadius < 1.5;
	});
};

async function loadPlanets(): Promise<Planet[]> {
	const path = join('.', 'kepler2.csv');
	const file = await Deno.open(path);
	const bufReader = new BufReader(file);
	const result = await parse(bufReader, {
		skipFirstRow: true,
		comment: '#'
	}) as Planet[];

	Deno.close(file.rid);

	const planets = filterHabitablePlanets(result);

	return planets.map(planet => pick(planet, ['kepler_name', 'koi_prad', 'koi_smass', 'koi_srad', 'koi_count', 'koi_steff']));
};

const habitablePlanets = await loadPlanets();

log.info(`${habitablePlanets.length} habitable-planets found`);

export function getPlanets() {
	return habitablePlanets; 
};