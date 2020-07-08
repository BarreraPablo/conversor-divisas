import {
    obtenerMonedasStorage, guardarMonedasStorage, guardarCambioStorage, obtenerCambioStorage,
} from './storage.js';

export async function obtenerMonedas() {
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

export function habilitarEventListeners() {
    const $selectDivisaEntry = document.querySelector('#moneda-entry');
    $selectDivisaEntry.addEventListener('change', realizarConversion.bind(null, true));

    const $selectDivisaOutput = document.querySelector('#moneda-output');
    $selectDivisaOutput.addEventListener('change', realizarConversion.bind(null, false));

    const $montoInput = document.querySelector('#monto-input');
    $montoInput.addEventListener('keyup', realizarConversion.bind(null, false));
}

async function obtenerCambios(divisaEntry) {
    let tipoCambios;
    try {
        tipoCambios = obtenerCambioStorage(divisaEntry);
    } catch (e) {
        const url = `https://api.frankfurter.app/latest?from=${divisaEntry}`;
        tipoCambios = await obtenerRespuestaAPI(url);
        guardarCambioStorage(divisaEntry, tipoCambios);
    }

    return tipoCambios;
}

async function realizarConversion(banDivisaEntry = false) {
    const valorDivisaEntry = document.querySelector('#moneda-entry').value;
    const valorDivisaOutput = document.querySelector('#moneda-output').value;
    const valorMontoInput = document.querySelector('#monto-input').value;
    let tipoCambios;

    if (banDivisaEntry && valorDivisaEntry !== '') { // Cuando cambia la divisa de entrada se obtienen y guardan los tipo de cambios de esa moneda
        tipoCambios = await obtenerCambios(valorDivisaEntry);
    }

    const $montoOutput = document.querySelector('#monto-output');
    if (valorDivisaEntry !== '' && valorDivisaOutput !== '' && valorMontoInput !== '' && Number(valorMontoInput) > 0) {
        if (!banDivisaEntry) {
            tipoCambios = obtenerCambioStorage(valorDivisaEntry);
        }
    
        const montoEntry = document.querySelector('#monto-input').value;
        const montoTotal = montoEntry * tipoCambios.rates[valorDivisaOutput];

        $montoOutput.value = montoTotal.toFixed(4);
    } else {
        $montoOutput.value = '';
    }
}

async function obtenerRespuestaAPI(url) {
    return fetch(url)
        .then((respuesta) => respuesta.json())
        // eslint-disable-next-line no-unused-vars
        .catch((e) => {
            throw new Error('No se pudo obtener respuesta de la API');
        });
}

export function setearMonedas(monedas) {
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
