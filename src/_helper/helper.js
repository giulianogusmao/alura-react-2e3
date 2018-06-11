export default class Helper {
    static _urlApi = 'https://instalura-api.herokuapp.com/api';
    static _authToken = 'auth-token';

    constructor() {
        throw new Error('Classe Helper não deve ser instanciada');
    }

    static get urlApi() {
        return this._urlApi;
    }

    static get authToken() {
        return `X-AUTH-TOKEN=${localStorage.getItem(this._authToken)}`;
    }

    static set authToken(token) {
        if (token) {
            localStorage.setItem(this._authToken, token);
        } else {
            throw new Error('Nenhum token definido');
        }
    }
}
