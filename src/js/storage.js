export function obtenerMonedasStorage (url) {
	const monedas = localStorage.getItem('monedas');

	if (monedas === null) {
		throw new Error('No estan almacenadas las monedas');
	}

	return JSON.parse(monedas);
}

export function guardarMonedasStorage (monedas) {
	localStorage.setItem('monedas', JSON.stringify(monedas));
}

export function guardarCambioStorage (divisa, cambios) {
	localStorage.setItem(divisa, JSON.stringify(cambios));
}

export function obtenerCambioStorage (divisa) {
	const cambios = localStorage.getItem(divisa);

	if (cambios === null) {
		throw new Error(`La divisa ${divisa} no esta almacenada`);
	}

	return JSON.parse(cambios);
}
