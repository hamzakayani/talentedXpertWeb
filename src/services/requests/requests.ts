export const BASE_URL = process.env.BASE_URL;
export const IMAGE_BASE_URL = process.env.BASE_URL + '/s3';
export const STRIPE_BASE_URL = process.env.BASE_URL + '/stripe';
export const DOMAIN = process.env.DOMAIN;
export const BASE_URL_AI = process.env.BASE_URL_AI;

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
  addtask: BASE_URL + '/tasks/create',
  getTaskId: BASE_URL + '/tasks/one/',
  editTask: BASE_URL + '/tasks/',
  getTaskOnStatus: BASE_URL + '/tasks/all/user/',

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

  /*  make contract */
  makeContract: BASE_URL + '/contracts',
  getContract: BASE_URL + '/contracts',
  editContract: BASE_URL + '/contracts/',

  /* milestones */
  makeMilestone: BASE_URL + '/milestones',
  getMilestones: BASE_URL + '/milestones',

  /* send or recieve msg */
  sendMsg: BASE_URL +'/messages/send',
  getMsg: BASE_URL + '/messages/getMessages',

  /* dispute */
  dispute :BASE_URL +'/dispute',
  editDispute:BASE_URL +'/dispute/',

  /* skills */
  getSkills : BASE_URL + '/skills',
  
  /* article */
  articles: BASE_URL + '/articles',

  /* reviews */
  reviews: BASE_URL + '/reviews',

  /* payments */
  connectStripeAccount: STRIPE_BASE_URL + `/connect-account`,
  paymentIntend: STRIPE_BASE_URL + `/payment-intent`,
  transactions: STRIPE_BASE_URL + '/transactions',
  balance: STRIPE_BASE_URL + '/balance',
  // confirmPayment: STRIPE_BASE_URL + `/confirm-intent`,

  /* generate bio */
  createBio: BASE_URL_AI + `/generate_bio`,
  createProposalDescription: BASE_URL_AI + `/generate_proposal`,

  /* countries */
  countries: BASE_URL + `/location/countries`,

    
}