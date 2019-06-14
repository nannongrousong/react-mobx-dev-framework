import request from 'ADMIN_UTILS/request';

export const getVCode = (params) => request('/Login/GetVCode', params);

export const cmsLogin = (params) => request('/Login/In', params);