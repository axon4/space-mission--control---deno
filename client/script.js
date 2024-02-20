let launches;

const numberHeading = 'ID'.padStart(5);
const dateHeading = 'Date'.padEnd(15);
const missionHeading = 'Mission'.padEnd(25);
const rocketHeading = 'Rocket'.padEnd(22);
const targetHeading = 'Destination';
const customersHeading = 'Customers';

function initValues() {
	const today = new Date().toISOString().split('T')[0];
	const launchDaySelector = document.getElementById('launch-day');

	launchDaySelector.setAttribute('min', today);
	launchDaySelector.setAttribute('value', today);
};

function loadLaunches() {};

function loadPlanets() {};

function abortLaunch() {};

function submitLaunch() {
	const flightNumber = launches[launches.length - 1].flightNumber + 1;
	const launchDate = new Date(document.getElementById('launch-day').value);
	const mission = document.getElementById('mission-name').value;
	const rocket = document.getElementById('rocket-name').value;
	const target = document.getElementById('planets-selector').value;
};

function listUpComing() {
	const upcomingList = document.getElementById('upcoming-list');

	upcomingList.innerHTML = `<div class='list-heading'>${numberHeading} ${dateHeading} ${missionHeading} ${rocketHeading} ${targetHeading}</div>`;
	launches.filter(launch => launch.upComing).forEach(launch => {
		const flightNumber = String(launch.flightNumber).padEnd(3);
		const launchDate = new Date(launch.launchDate * 1000).toDateString();
		const mission = launch.mission.slice(0, 25).padEnd(25);
		const rocket = launch.rocket.padEnd(22);
		const target = launch.target ?? '';

		upcomingList.innerHTML += `<div class='list-item'><a class='delete' onclick='abortLaunch(${launch.flightNumber})'>✖</a> ${flightNumber} <span class='silver'>${launchDate}</span> ${mission} <span class='silver'>${rocket}</span> <span class='gold'>${target}</span></div>`;
	});
};

function listHistory() {
	const historyList = document.getElementById('history-list');

	historyList.innerHTML = `<div class='list-heading'>${numberHeading} ${dateHeading} ${missionHeading} ${rocketHeading} ${customersHeading}</div>`;
	launches.filter(launch => !launch.upComing).forEach(launch => {
		const success = launch.success ? `<span class='success'>█</span>` : `<span class='failure'>█</span>`;
		const flightNumber = String(launch.flightNumber).padEnd(3);
		const launchDate = new Date(launch.launchDate * 1000).toDateString();
		const mission = launch.mission.slice(0, 25).padEnd(25);
		const rocket = launch.rocket.padEnd(22);
		const customers = launch.customers.join(', ').slice(0, 27);
		
		historyList.innerHTML += `<div class='list-item'>${success} ${flightNumber} <span class='silver'>${launchDate}</span> ${mission} <span class='silver'>${rocket}</span> ${customers}</div>`;
	});
};

function navigate(to) {
	const pages = ['history', 'upComing', 'launch'];

	document.getElementById(to).hidden = false;
	pages.filter(page => page !== to).forEach(page => {
		document.getElementById(page).hidden = true;
	});
	document.getElementById('launch-success').hidden = true;

	if (to === 'upComing') {
		loadLaunches();
		listUpComing();
	} else if (to === 'history') {
		loadLaunches();
		listHistory();
	};
};

window.onload = () => {
	initValues();
	loadLaunches();
	loadPlanets();
};