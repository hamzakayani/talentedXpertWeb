export const BASE_URL = process.env.BASE_URL;
export const IMAGE_BASE_URL = process.env.BASE_URL + '/s3';
export const DOMAIN = process.env.DOMAIN;

export const requests = {
    /* auth */
    login: BASE_URL + '/auth/login',
    userSessionLogout: BASE_URL + '/user-session/logout',
    signup: BASE_URL + '/users/createUser',

    /* get user */
    getUserInfo: BASE_URL + '/users/one/',
    getUserAll: BASE_URL + '/users/all',
    editUser: BASE_URL + '/users/',

    /* tasks */
    getTasks: BASE_URL + '/tasks/all',
    getUserTasks: BASE_URL + '/tasks/all/user',
    addtask: BASE_URL + '/tasks/create',
    getTaskId: BASE_URL + '/tasks/one/',
    editTask: BASE_URL + '/tasks/',

    /* get category */
    getCategory: BASE_URL + '/categories',

    /* proposals */
    getProposals: BASE_URL + '/proposals/getProposal',
    addProposal: BASE_URL + '/proposals/add',
    updateProposal: BASE_URL + '/proposals/',

    /* messages and thread */
    getThread: BASE_URL + '/messages/threads',
    createThread: BASE_URL + '/messages/createThread',

    /* upload file or document */    
    documentPreSigned: IMAGE_BASE_URL + '/presigned-url',
    documentPostSigned: IMAGE_BASE_URL + '/upload',
    getFile: IMAGE_BASE_URL + '/',
    downloadFile: IMAGE_BASE_URL + '/download',

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

   // dispute
    dispute :BASE_URL +'/dispute',
    editDispute:BASE_URL +'/dispute/'

    
}