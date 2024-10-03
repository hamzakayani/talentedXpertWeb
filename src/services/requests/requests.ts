export const BASE_URL = process.env.BASE_URL;
export const clientApi = process.env.BASE_URL + '/client/';
export const DOMAIN = process.env.DOMAIN;

export const requests = {
    login: BASE_URL + '/auth/login',
    userSessionLogout: BASE_URL + '/user-session/logout',
    signup: BASE_URL + '/users/createUser',

    /* get user detail */
    getUserInfo: BASE_URL + '/users/one', 


}