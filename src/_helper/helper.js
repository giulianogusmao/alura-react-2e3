export default class Helper {
    static _urlApi = 'https://jsonplaceholder.typicode.com';

    constructor() {
        throw new Error('Classe Helper não deve ser instanciada');
    }

    static get urlApi() {
        return this._urlApi;
    }
}
