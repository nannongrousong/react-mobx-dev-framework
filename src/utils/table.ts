import moment from 'moment';

/**
 * 表格默认配置
 */
export const tablePageDefaultOpt = {
	showSizeChanger: true,
	showQuickJumper: true,
	pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
	size: 'small',
	showTotal: (total: number, range: any) => (`第${range[0]}-${range[1]}条 共${total}条`)
};

/**
 * 生成表格列信息
 * @param {*} columnsMap 
 */
export const generateColInfo = (columnsMap: any) => {
	let allWidth = 0;
	return [
		columnsMap.map((aColumn: any) => {
			const [dataIndex, title, render = null, width = 130, fixed = null, align = 'center'] = aColumn;
			allWidth += typeof width == 'number' ? width : 130;
			return { dataIndex, title, render, align, width, fixed };
		}),
		allWidth
	];
};

/**
 * 日期格式
 * @param {String} text 
 * @returns {String} YYYY-MM-DD
 */
export const dateRender = (text: string) => {
	if (!text) { return ''; }
	let tempRes = moment(text);
	return tempRes.isValid() ? tempRes.format('YYYY-MM-DD') : '';
};

/**
 * 时间格式
 * @param {String} text 
 * @returns {String} YYYY-MM-DD HH:mm:ss
 */
export const dateTimeRender = (text: string) => {
	if (!text) { return ''; }
	let tempRes = moment(text);
	return tempRes.isValid() ? tempRes.format('YYYY-MM-DD HH:mm:ss') : '';
};

/**
 * 日期-月-格式
 * @param {String} text 
 * @returns {String} YYYY-MM
 */
export const dateMonthRender = (text: string) => {
	if (!text) { return ''; }
	let tempRes = moment(text);
	return tempRes.isValid() ? tempRes.format('YYYY-MM') : '';
};

/**
 * 分->元
 * @param {String} text 
 */
export const moneyRender = (text: string) => ((!isNaN(text) && (Number(text) / 100).toFixed(2)) || 0);