export function obtenerMonedasStorage () {
    const monedas = localStorage.getItem('monedas');

    if (monedas === null) {
        throw new Error('No estan almacenadas las monedas');
    }

    return JSON.parse(monedas);
}

export function guardarMonedasStorage (monedas) {
    try {
        localStorage.setItem('monedas', JSON.stringify(monedas));
    } catch (e) {
        localStorage.clear();
    }
}

export function guardarCambioStorage (divisa, cambios) {
    try {
        localStorage.setItem(divisa, JSON.stringify(cambios));
    } catch (e) {
        localStorage.clear();
    }
}

export function obtenerCambioStorage (divisa) {
    const cambios = localStorage.getItem(divisa);

    if (cambios === null) {
        throw new Error(`La divisa ${divisa} no esta almacenada`);
    }

    return JSON.parse(cambios);
}
