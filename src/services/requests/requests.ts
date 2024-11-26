export const BASE_URL = process.env.BASE_URL;
export const IMAGE_BASE_URL = process.env.BASE_URL + '/s3';
export const DOMAIN = process.env.DOMAIN;

export const requests = {
    /* auth */
    login: BASE_URL + '/auth/login',
    userSessionLogout: BASE_URL + '/user-session/logout',
    signup: BASE_URL + '/users/createUser',

    /* get user detail */
    getUserInfo: BASE_URL + '/users/one/',

    /* tasks */
    getTasks: BASE_URL + '/tasks/all',
    addtask: BASE_URL + '/tasks/create',
    getTaskId: BASE_URL + '/tasks/one/',
    editTask: BASE_URL + '/tasks/',

    /* get category */
    getCategory: BASE_URL + '/categories',

    /* proposals */
    getProposals: BASE_URL + '/proposals/getProposal',
    addProposal: BASE_URL + '/proposals/add',
    editProposal: BASE_URL + '/proposals/',

    /* messages and thread */
    getThread: BASE_URL + '/messages/threads',
    createThread: BASE_URL + '/messages/createThread',

    /* upload file or document */    
    documentPreSigned: IMAGE_BASE_URL + '/presigned-url',
    documentPostSigned: IMAGE_BASE_URL + '/upload',
    getFile: IMAGE_BASE_URL + '/',
    //  make contract
    makeContract: BASE_URL + '/contracts',
    getContract: BASE_URL + '/contracts',
    editContract: BASE_URL + '/contracts/',
    // milestones
    makeMilestone: BASE_URL + '/milestones',
    getMilestones: BASE_URL + '/milestones',

    // send or recieve msg
    sendMsg: BASE_URL +'/messages/send',
    getMsg: BASE_URL + '/messages/getMessages',

    
}