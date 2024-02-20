import { assertEquals } from 'https://deno.land/std@0.60.0/testing/asserts.ts';
import { filterHabitablePlanets } from './planets.ts';

const HABITABLE = {
	koi_disposition: 'CONFIRMED',
	koi_srad: '1',
	koi_smass: '1',
	koi_prad: '1'
};

const NOT_CONFIRMED = {
	koi_disposition: 'FALSE POSITIVE',
	koi_srad: '1',
	koi_smass: '1',
	koi_prad: '1'
};

const TOO_LARGE_STELLAR_RADIUS = {
	koi_disposition: 'CONFIRMED',
	koi_srad: '1.02',
	koi_smass: '1',
	koi_prad: '1'
};

const TOO_LARGE_STELLAR_MASS = {
	koi_disposition: 'CONFIRMED',
	koi_srad: '1',
	koi_smass: '1.04',
	koi_prad: '1'
};

const TOO_LARGE_PLANETARY_RADIUS = {
	koi_disposition: 'CONFIRMED',
	koi_srad: '1',
	koi_smass: '1',
	koi_prad: '1.5'
};

Deno.test('filter habitable planets', () => {
	const planets = filterHabitablePlanets([HABITABLE, NOT_CONFIRMED, TOO_LARGE_STELLAR_RADIUS, TOO_LARGE_STELLAR_MASS, TOO_LARGE_PLANETARY_RADIUS]);

	assertEquals(planets, [HABITABLE]);
});