import request from 'ADMIN_UTILS/request';

/**
 * 导入预览的结果导出到excel
 * @param {*} params 
 */
export const expImpPrev = (params) => request('/Name/ExportImportPreview', params);

/**
 * 生成平台用户
 * @param {*} params 
 */
export const commitImp = (params) => request('/Name/GenerateByBizID', params);

/**
 * 获取平台用户列表
 * @param {*} params 
 */
export const listName = (params) => request('/Name/List', params);

/**
 * 根据BizID获取异步结果
 * @param {*} params 
 */
export const getResByBizID = (params) => request('/Name/GetResultByBizID', params);

/**
 * 导入预览
 * @param {*} params 
 */
export const impPrev = (params) => request('/Name/ImportPreivew', params);

/**
 * 作废平台用户
 * @param {*} params 
 */
export const destoryName = (params) => request('/Name/Delete', params);