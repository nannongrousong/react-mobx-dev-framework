import { Form } from 'antd';

/**
 * 操作按钮布局
 * @param {*} itemCount 搜索条件的个数
 */
export const getFormOptLayout = (itemCount) => {
    return {
        lg: { span: (4 - itemCount % 4) * 6 },
        md: { span: (3 - itemCount % 3) * 8 },
        sm: { span: (2 - itemCount % 2) * 12 }
    };
};

/**
 * 具体formItem内部wrapper和label布局
 */
export const formItemLayout = {
    labelCol: { span: 8, offset: 0 },
    wrapperCol: { span: 16, offset: 0 }
};

/**
 * 具体formItem整体布局
 */
export const formLayout = {
    sm: { span: 12, offset: 0 },
    md: { span: 8, offset: 0 },
    lg: { span: 6, offset: 0 }
};

/**
 * 将redux中存储的值转化成antd Form中可识别对象
 * @param {当前记录} record 
 * @param {field存在的前缀} fieldPrefix 
 */
export const createFormField = (record, fieldPrefix) => (
    Object.keys(record).reduce((previousObj, currentKey) => {
        previousObj[(fieldPrefix || '') + currentKey] = Form.createFormField({
            //  ...record,
            value: record[currentKey]
        });
        return previousObj;
    }, {})
);

/**
 * select 输入查询
 * @param {*} input 
 * @param {*} option 
 */
export const selectInputSearch = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

/**
 * 文件的校验规则。校验两部分：文件必填；所在的文件必须全部上传成功
 */
export const fileValidateRule = {
    rules: [{
        //  保证页面显示 红* 
        required: true,
        //  避免校验两次，重复显示提示信息
        message: ' '
    },{
        validator: (rule, value, callBack) => {
            let fileList = [];
            if (Array.isArray(value)) {
                fileList = value;
            } else {
                fileList = value.fileList;
            }
            if (fileList.length === 0) {
                callBack('请上传文件');
            }
            fileList.forEach(({ status }) => {
                if (status === 'error') {
                    callBack('文件上传失败，请重新上传');
                }
            });
            callBack();
        }
    }]
};