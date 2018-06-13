export default class Helper {
    static _urlApi = 'https://instalura-api.herokuapp.com/api';
    static _authToken = 'auth-token';

    constructor() {
        throw new Error('Classe Helper não deve ser instanciada');
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

    static api(requestUrl, msgError = '', requestInfo = { method: 'GET' }) {
        const url = this._urlApi + requestUrl;

        return new Promise(
            (resolve, reject) => {
                fetch(url, requestInfo)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw response.status;
                        }
                    })
                    .then(value => 
                        resolve(value)
                    )
                    .catch(err => {
                        console.error(`${url}, Status Error: ${err}, Message: ${msgError}`);
                        reject(msgError);
                    });
            }
        );
    }
}
