import request, { requestComJson } from 'ADMIN_UTILS/request';

export const getSercetKey = param => request('/Aliyun/GetSTS', param);

//  查询结果aliyun
export const getAliData = (url) => requestComJson(url);