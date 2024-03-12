import httpClient from './index';

const PREFIX = '/admin/auth';

export function login(data) {
    return httpClient.post(`${PREFIX}/login`, data);
}
//logout
export function logout() {
    return httpClient.post(`${PREFIX}/logout`);
}
