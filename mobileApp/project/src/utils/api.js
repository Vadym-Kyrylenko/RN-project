import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
const config = require('../../config').APPCONST;

export const checkStatus = (response) => {
    return new Promise((resolve, reject) => {
        const error = new Error();
        if (response.errors) {
            reject(response);
        } else {
            resolve(response);
            return;
        }

        if (response.status === 401) {
        }

        new Promise((res) => {
            res(response);
        }).then(() => {
            reject(error);
        });
    });
};

export const request = async (url, method, data, params) => {
    const accessToken = await AsyncStorage.getItem('token');
    let queries = '';
    if (params) {
        queries = params;
    }
    let requestUrl;
    if (url.substring(0, 4) === 'http') {
        requestUrl = `${url}${queries}`;
    } else {
        requestUrl = `${config.URL}/${url}${queries}`;
    }

    return new Promise((resolve, reject) => {
        console.log('API REQUEST', requestUrl, data);
        fetch(requestUrl, {
            method: method || 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: method !== 'GET' && data && JSON.stringify(data) || undefined
        })
            .then((response) => {
                return response;
            })

            .then((response) => {
                return response.json();
            })
            .then(checkStatus)
            .then((response) => {
                console.log('API RESPONSE', response);
                return response;
            })
            .then(resolve)
            .catch((error) => {
                console.warn('API error: ', error, _.get(error, 'response.text'));
                throw error;
            })
            .catch(reject);
    });
};

export const get = (url, params) => {
    return request(url, 'GET', null, params);
};

export const post = (url, data) => {
    return request(url, 'POST', data);
};

export const put = (url, data) => {
    return request(url, 'PUT', data);
};

export const del = (url, data) => {
    return request(url, 'DELETE', data);
};
