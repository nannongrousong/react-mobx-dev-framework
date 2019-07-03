import React, { Component } from 'react';
import { Form, Row, Col, Button, Input } from 'antd';
import { formItemLayout, formLayout, createFormField, fileValidateRule } from '@/utils/form';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import uploadRule from '@/config/uploadRule';
import AliUpload from '@/component/AliUpload';

const FormItem = Form.Item;

@observer
class SearchForm extends Component {
    shouldComponentUpdate(prevProps: any): boolean {
        const { searchValue: val1 } = prevProps;
        const { searchValue: val2 } = this.props as any;

        if (JSON.stringify(val1) === JSON.stringify(val2)) {
            return false;
        }

        return true;
    }

    impPrev = (e: any) => {
        e.preventDefault();
        const { form, impPrev } = this.props as any;
        form.validateFields((err: any) => {
            if (err) {
                return;
            }

            impPrev();
        });
    }

    render() {
        const {
            expImpPrev,
            commitImp,
            resetForm,
            searchValue: {
                ImportFile
            },
            form: { getFieldDecorator }
        } = this.props as any;

        return (
            <Form onSubmit={this.impPrev}>
                <Row gutter={15} type='flex' justify='start'>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='Excel文件'>
                            {getFieldDecorator('ImportFile', fileValidateRule)(
                                <AliUpload
                                    accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                    oss={uploadRule.nameImport}
                                    fileList={ImportFile} >
                                </AliUpload>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='sheet名称'>
                            {getFieldDecorator('SheetName', {
                                rules: [{ required: true, message: '请填写表单名称' }]
                            })(
                                <Input maxLength={100} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12} className='text-right'>
                        <FormItem>
                            <Button htmlType='submit' type='primary'>导入预览</Button>
                            <Button type='primary' className='ml-8' onClick={expImpPrev}>导出预览结果</Button>
                            <Button type='primary' className='ml-8' onClick={commitImp}>提交保存</Button>
                            <Button type='primary' className='ml-8' onClick={resetForm}>重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm.propTypes = {
    form: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    searchValue: PropTypes.object.isRequired,
    expImpPrev: PropTypes.func.isRequired,
    commitImp: PropTypes.func.isRequired,
    impPrev: PropTypes.func.isRequired
};

SearchForm = Form.create({
    mapPropsToFields: (props: any) => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => props.handleFormChange(changedValues, allValues)
})(SearchForm);

export default SearchForm;