export const BASE_URL = process.env.BASE_URL;
export const clientApi = process.env.BASE_URL + '/client/';
export const DOMAIN = process.env.DOMAIN;

export const requests = {
    /* auth */
    login: BASE_URL + '/auth/login',
    userSessionLogout: BASE_URL + '/user-session/logout',
    signup: BASE_URL + '/users/createUser',

    /* get user detail */
    getUserInfo: BASE_URL + '/users/one',

    /* tasks */
    getTasks: BASE_URL + '/tasks/all',
    addtask: BASE_URL + '/tasks/create',
    getTaskId: BASE_URL + '/tasks/one/',

    getCategory: BASE_URL + '/categories',

    getProposals: BASE_URL + '/proposals/getProposal',

    addProposal: BASE_URL + '/proposals/add',

    getThread: BASE_URL + '/messages/threads',

    createThread: BASE_URL + '/messages/createThread',
    
    uploadfile: BASE_URL + '/s3/upload'
    


}