import {
	obtenerMonedasStorage, guardarMonedasStorage, guardarCambioStorage, obtenerCambioStorage
} from './storage.js';

export async function obtenerMonedas () {
	let monedas;
	try {
		monedas = obtenerMonedasStorage();
	} catch (e) {
		const url = 'https://api.frankfurter.app/currencies';

		monedas = await obtenerRespuestaAPI(url);
		guardarMonedasStorage(monedas);
	}

	return monedas;
}

let banSelectEntry = false;
let banSelectOutput = false;
let banMonto = false;

function eventSelectEntry ($selectDivisa) {
	if ($selectDivisa.value !== '') {
		banSelectEntry = true;
	} else if ($selectDivisa.value === '') {
		banSelectEntry = false;
	}

	realizarConversion();
}

function eventSelectOutput ($selectDivisa) {
	if ($selectDivisa.value !== '') {
		banSelectOutput = true;
	} else if ($selectDivisa.value === '') {
		banSelectOutput = false;
	}

	realizarConversion();
}

function eventMontoInput ($montoInput) {
	if ($montoInput.value !== '') {
		banMonto = true;
	} else if ($montoInput.value === '') {
		banMonto = false;
	}
	if (Number($montoInput.value) <= 0) {
		banMonto = false;
	}

	realizarConversion();
}

export function habilitarEventListeners () {
	const $selectDivisaEntry = document.querySelector('#moneda-entry');
	$selectDivisaEntry.addEventListener('change', eventSelectEntry.bind(null, $selectDivisaEntry));

	const $selectDivisaOutput = document.querySelector('#moneda-output');
	$selectDivisaOutput.addEventListener('change', eventSelectOutput.bind(null, $selectDivisaOutput));

	const $montoInput = document.querySelector('#monto-input');

	$montoInput.addEventListener('keyup', eventMontoInput.bind(null, $montoInput));
}

async function realizarConversion () {
	if (banSelectEntry && banSelectOutput && banMonto) {
		const divisaEntry = document.querySelector('#moneda-entry').value;
		const divisaOutput = document.querySelector('#moneda-output').value;
		let tipoCambios;

		try {
			tipoCambios = obtenerCambioStorage(divisaEntry);
		} catch (e) {
			tipoCambios = await obtenerCambios(divisaEntry);
		}

		const montoEntry = document.querySelector('#monto-input').value;
		const montoTotal = montoEntry * tipoCambios.rates[divisaOutput];

		const $montoOutput = document.querySelector('#monto-output');
		$montoOutput.value = montoTotal.toFixed(4);
	}
}

async function obtenerCambios (divisaEntry) {
	const url = `https://api.frankfurter.app/latest?from=${divisaEntry}`;
	return fetch(url)
		.then((respuesta) => (respuesta.json()))
		.then((respuesta) => {
			guardarCambioStorage(divisaEntry, respuesta);
			return respuesta;
		});
}

async function obtenerRespuestaAPI (url) {
	return fetch(url)
		.then((respuesta) => respuesta.json())
		.catch((e) => {
			throw new Error('No se pudo obtener respuesta de la API');
		});
}

export function setearMonedas (monedas) {
	const nombresCompleto = Object.values(monedas);
	const abreviaciones = Object.keys(monedas);

	const etiquetas = nombresCompleto.map((nombre, index) => `${abreviaciones[index]} - ${nombre}`);

	const $monedaSelectEntry = document.querySelector('#moneda-entry');
	const $monedaSelectOutput = document.querySelector('#moneda-output');

	abreviaciones.forEach((abreviacion, index) => {
		const $opcion = document.createElement('option');
		$opcion.setAttribute('value', abreviacion);
		$opcion.textContent = etiquetas[index];

		$monedaSelectEntry.appendChild($opcion);
	});

	abreviaciones.forEach((abreviacion, index) => {
		const $opcion = document.createElement('option');
		$opcion.setAttribute('value', abreviacion);
		$opcion.textContent = etiquetas[index];

		$monedaSelectOutput.appendChild($opcion);
	});
}
