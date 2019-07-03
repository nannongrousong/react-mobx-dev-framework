import request, { requestComJson } from '@/utils/request';

export const getSercetKey = (param: any) => request('/Aliyun/GetSTS', param);

//  查询结果aliyun
export const getAliData = (url: string) => requestComJson(url);