import { join } from 'https://deno.land/std@0.95.0/path/mod.ts';
import { parse } from 'https://deno.land/std@0.95.0/encoding/csv.ts';
import { BufReader } from 'https://deno.land/std@0.95.0/io/bufio.ts';
import { pick } from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

type Planet = Record<string, string>;

async function loadPlanets(): Promise<Planet[]> {
	const path = join('.', 'kepler2.csv');
	const file = await Deno.open(path);
	const bufReader = new BufReader(file);
	const result = await parse(bufReader, {
		skipFirstRow: true,
		comment: '#'
	}) as Planet[];

	Deno.close(file.rid);

	const planets = result.filter(planet => {
		const stellarRadius = Number(planet.koi_srad);
		const stellarMass = Number(planet.koi_smass);
		const planetaryRadius = Number(planet.koi_prad);

		return planet.koi_disposition === 'CONFIRMED' && stellarRadius > 0.99 && stellarRadius < 1.01 && stellarMass > 0.78 && stellarMass < 1.04 && planetaryRadius > 0.5 && planetaryRadius < 1.5;
	});

	return planets.map(planet => pick(planet, ['kepler_name', 'koi_prad', 'koi_smass', 'koi_srad', 'koi_count', 'koi_steff']));
};

const habitablePlanets = await loadPlanets();

console.log(`${habitablePlanets.length} habitable-planets found`);

export function getPlanets() {
	return habitablePlanets; 
};