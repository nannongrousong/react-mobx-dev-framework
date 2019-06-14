import React, { Component } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { cmsLogin } from 'ADMIN_SERVICE/Login';
import { getVCode } from 'ADMIN_SERVICE/Login';
import { errorHandle } from 'ADMIN_UTILS/index';
import { AES } from 'crypto-js';
import styles from 'ADMIN_STYLES/page/login.less';
import logoImg from 'ADMIN_IMAGES/logo.jpg';
import { appSecret } from 'ADMIN_CONFIG';

const FormItem = Form.Item;
//  发送验证码时间间隔，单位秒
const SEND_VCODE_INTERVAL = 60;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: !!sessionStorage.getItem('UAI'),
            //  限制下一次获取验证码时间
            countdownTime: 0,
            //  允许发送验证码
            enableSendVCode: false
        };
    }

    componentWillUnmount() {
        clearInterval(this.getVCodeTimer);
    }

    getVCode = async () => {
        try {
            const { form } = this.props;
            //  输入时已校验，此处无需再校验
            const reqParam = {
                SPhone: form.getFieldValue('Mobile')
            };
            await getVCode(reqParam);
            this.setState({
                countdownTime: SEND_VCODE_INTERVAL,
                enableSendVCode: false
            });

            this.getVCodeTimer = setInterval(() => {
                const { countdownTime } = this.state;
                if (countdownTime === 0) {
                    clearInterval(this.getVCodeTimer);
                } else {
                    this.setState({
                        countdownTime: countdownTime - 1,
                        //  保证计时到零和按钮同时启用
                        enableSendVCode: countdownTime === 1
                    });
                }
            }, 1000);
        } catch (err) {
            errorHandle(err);
        }
    }

    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            try {
                let resData = await cmsLogin(values);
                const { Data: userInfo } = resData;
                //  保存sessionStorage 以便刷新页面 userAuthInfo
                sessionStorage.setItem('UAI', AES.encrypt(JSON.stringify(userInfo), appSecret));
                this.setState({
                    isLogin: true
                });
            } catch (err) {
                errorHandle(err);
            }
        });
    }

    render() {
        const {
            form: { getFieldDecorator },
            history: { location: { state } }
        } = this.props;
        const { isLogin, enableSendVCode, countdownTime } = this.state;
        let from = state && state.from;

        return (
            !isLogin
                ? <div className={`${styles.wrapper} w-100 h-100`}>
                    <img src={logoImg} className={styles['login-img']}></img>

                    <h1 className='mt-16 mb-16'>开放平台</h1>
                    <Form className={styles.form} onSubmit={this.handleLogin} autoComplete='off'>
                        <FormItem>
                            {getFieldDecorator('Mobile', {
                                rules: [{
                                    required: true,
                                    message: '请输入手机号'
                                }, {
                                    validator: (rule, value = '', callBack) => {
                                        const validateRes = /^1[3-9]\d{9}$/.test(value);
                                        this.setState({ enableSendVCode: validateRes });

                                        if (value.length === 11 && !validateRes) {
                                            callBack('请输入正确的手机号');
                                        }

                                        callBack();
                                    }
                                }],
                            })(
                                <Input
                                    size='large'
                                    maxLength={11}
                                    prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder='手机号' />
                            )}
                        </FormItem>
                        <Row>
                            <Col span={13}>
                                <FormItem>
                                    {getFieldDecorator('VerifyCode', {
                                        rules: [{
                                            required: true,
                                            message: '请输入验证码'
                                        }],
                                    })(
                                        <Input
                                            size='large'
                                            maxLength={6}
                                            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type='VerifyCode'
                                            placeholder='验证码' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} className='text-right'>
                                <FormItem>
                                    <Button
                                        size='large'
                                        onClick={this.getVCode}
                                        disabled={!enableSendVCode}>
                                        获取验证码{countdownTime === 0 ? '' : `(${countdownTime}s)`}
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>

                        <FormItem>
                            <Button
                                type='primary'
                                className='w-100'
                                size='large'
                                htmlType='submit'>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                : <Redirect to={from || '/index'}></Redirect>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object,
    form: PropTypes.object
};

Login = Form.create()(Login);

export default Login;