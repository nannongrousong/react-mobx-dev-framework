import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, Input, DatePicker } from 'antd';
import { formItemLayout, formLayout, createFormField, getFormOptLayout } from '@/utils/form';

const FormItem = Form.Item;
const Option = Select.Option;

interface FormProp {
    form: any;
    resetForm: () => void;
    searchValue: any;
    startQuery: () => void;
    destoryName: () => void;
    resetPageCurrent: () => void;
}

class SearchForm extends Component<FormProp> {
    shouldComponentUpdate(prevProps: { searchValue: any }): boolean {
        const { searchValue: val1 } = prevProps;
        const { searchValue: val2 } = this.props as any;

        if (JSON.stringify(val1) === JSON.stringify(val2)) {
            return false;
        }

        return true;
    }

    startQuery = (e: any) => {
        e.preventDefault();
        const { form, startQuery, resetPageCurrent } = this.props as any;
        form.validateFields((err: any) => {
            if (err) {
                return;
            }

            resetPageCurrent();
            startQuery();
        });
    }

    render() {
        const { resetForm, destoryName, form: { getFieldDecorator } } = this.props as any;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type='flex' justify='start'>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='日期'>
                            {getFieldDecorator('IntvDate')(
                                <DatePicker.RangePicker />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('UserName')(
                                <Input maxLength={10} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='身份证号码'>
                            {getFieldDecorator('IDCardNum', {
                                rules: [{
                                    pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                    message: '请输入正确的18位身份证号'
                                }]
                            })(
                                <Input maxLength={18} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='状态'>
                            {getFieldDecorator('IsValid', {
                                initialValue: -9999
                            })(
                                <Select placeholder='请选择'>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>正常</Option>
                                    <Option value={2}>作废</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...getFormOptLayout(4)} className='text-right'>
                        <FormItem>
                            <Button type='primary' className='ml-8' onClick={destoryName}>作废</Button>
                            <Button type='primary' className='ml-8' onClick={resetForm}>重置</Button>
                            <Button htmlType='submit' type='primary' className='ml-8'>查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => props.handleFormChange(changedValues, allValues)
})(SearchForm);

export default SearchForm;