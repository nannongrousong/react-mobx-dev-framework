import request from '@/utils/request';

/**
 * 导入预览的结果导出到excel
 * @param {*} params 
 */
export const expImpPrev = (params: any) => request('/Name/ExportImportPreview', params);

/**
 * 生成平台用户
 * @param {*} params 
 */
export const commitImp = (params: any) => request('/Name/GenerateByBizID', params);

/**
 * 获取平台用户列表
 * @param {*} params 
 */
export const listName = (params: any) => request('/Name/List', params);

/**
 * 根据BizID获取异步结果
 * @param {*} params 
 */
export const getResByBizID = (params: any) => request('/Name/GetResultByBizID', params);

/**
 * 导入预览
 * @param {*} params 
 */
export const impPrev = (params: any) => request('/Name/ImportPreivew', params);

/**
 * 作废平台用户
 * @param {*} params 
 */
export const destoryName = (params: any) => request('/Name/Delete', params);