import { obtenerMonedas, habilitarEventListeners, setearMonedas } from './funciones.js';

async function inicializar () {
	const monedas = await obtenerMonedas();
	setearMonedas(monedas);
	habilitarEventListeners();
}

inicializar();
