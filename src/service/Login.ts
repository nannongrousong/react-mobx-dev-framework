import request from '@/utils/request';

export const getVCode = (params: any) => request('/Login/GetVCode', params);

export const cmsLogin = (params: any) => request('/Login/In', params);