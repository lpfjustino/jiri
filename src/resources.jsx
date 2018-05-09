import _ from 'underscore';

export const API_BASE_URL = "localhost";
export const API_PORT = "1337";
export const FULL_URL = `http://${API_BASE_URL}:${API_PORT}`;

export const departments = [
    "Cortador",
    "Pesponto",
    "Bordado",
    "Solador"
]

export function arrayToObject(acc, cur, i) {
    const key = Object.keys(cur)[0];
    const value = cur[Object.keys(cur)[0]]
    acc[key] = value;
    return acc;
}

export const sizes = ["34", "35", "36", "37", "38", "39"];

// Auxiliar tool when shoes may come in different sizes other than the predefined ones
function getSizes() {
    const orderSizes = _.pluck(this.props.items, "sizes");
    const sizesByModel = orderSizes.map(el => Object.keys(el));
    const sizes = _.reduce(sizesByModel, (el1, el2) => _.union(el1, el2));
    return sizes;
}