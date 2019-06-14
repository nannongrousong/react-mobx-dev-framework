/**
* 安全更新viewModel，使得viewModel.reset()时可以正确恢复到原始值。
* 用法：this.safeEditViewModel('tableInfo.loading', true);
* 或this.safeEditViewModel('ImportBizID', BizID);
* 当然也可以直接使用viewModel.observerObj = newValue;
* 但千万不可以使用viewModel.observerObj.prop = newValue;
* @param {string} viewModel
* @param {string} field 更新的字段，如tempBizID或tableInfo.loading 
* @param {string} value 字段值
*/
export const safeEditViewModel = (viewModel, field, value) => {
    const fields = field.split('.');
    const { length } = fields;
    if (length > 2) {
        throw new Error('只支持field = value; 或 field.key = value');
    }

    //  observer对象 和 observer对象中的属性
    const [obs, prop] = fields;
    //  const viewModel = this.viewModel;
    if (length === 1) {
        viewModel[obs] = value;
    } else {
        viewModel[obs] = {
            ...viewModel[obs],
            [prop]: value
        };
    }
};