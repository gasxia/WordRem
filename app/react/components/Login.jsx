import React from 'react';
import { Button, Form, Input, Modal, message, Select } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
function noop() {
  return false;
}

let LoginForm = React.createClass({
    getInitialState() {
        return {
            login_visible: false,
            register_visible: false,
            set_visible: false,
            wordtag:'',
            daycount:20,
        };
    },

    handleLoginSubmit() {
        console.log(this.props.form.getFieldsValue());
        $.ajax({
            type: 'post',
            url: '/auth/login',
            data: this.props.form.getFieldsValue()
        }).done((resp) => {
            if (resp.status == "success") {
                localStorage.setItem('is_login', 1);
                localStorage.setItem('username', resp.username);
                message.success('登录成功');
                this.hideLoginModal();
            } else {
                message.error('Email账号或密码错误');
            }
        })
    },
    handleLogin() {
        if (localStorage.getItem('is_login') == 1) {
            $.ajax({
                type: 'get',
                url: '/auth/logout'
            }).done((resp) => {
                localStorage.setItem('is_login', 0);
                localStorage.setItem('username', null);
                message.success('成功退出登录');
                //重设state值，触发渲染
                this.hideLoginModal();
            })
        } else {
            this.showLoginModal();
        }
    },
    handleRegAndSet() {
        if (localStorage.getItem('is_login') == 1) {
            this.showSetModal();
        } else {
            this.showRegisterModal();
        }
    },

    handleRegisterSubmit() {
        console.log(this.props.form.getFieldsValue());
        $.ajax({
            type: 'post',
            url: '/auth/register',
            data: this.props.form.getFieldsValue()
        }).done((resp) => {
            if (resp.status == "success") {
                message.success('注册成功，现在可以登录了');
                this.hideRegisterModal();
                this.showLoginModal();
            } else if (resp.status == "fail") {
                message.error(resp.error);
            } else {
                message.error("未知错误，请重新注册")
            }
        })
    },
    handleSetSubmit() {
        $.ajax({
            type: 'post',
            url: '/set',
            data: {
                wordtag: this.state.wordtag,
                daycount: this.state.daycount
            }
        }).done((resp) => {
            if (resp.status == "success") {
                message.success('更改成功');
                this.hideSetModal();
            } else if (resp.status == "fail") {
                message.error(resp.error);
            } else {
                message.error("未知错误，请重新设置或检查网络")
            }
        })
    },
    handleRegister() {
        if (localStorage.getItem('is_login') == 1) {
            $.ajax({
                type: 'get',
                url: '/auth/logout'
            }).done((resp) => {
                localStorage.setItem('is_login', 0);
                message.success('成功退出登录');
                //重设state值，触发渲染
                this.hideLoginModal();
            })
        } else {
            this.showLoginModal();
        }
    },

    showLoginModal() {
        this.setState({login_visible: true});
    },
    hideLoginModal() {
        this.setState({login_visible: false});
    },

    showRegisterModal() {
        this.setState({register_visible: true});
    },
    hideRegisterModal() {
        this.setState({register_visible: false});
    },

    showSetModal() {
        this.setState({set_visible: true});
    },
    hideSetModal() {
        this.setState({set_visible: false});
    },

    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['repassword_reg'], {force: true});
        }
        callback();
    },

    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('password_reg')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },

    handleWordtagChange(value){
        this.state.wordtag = value;
    },
    handleDaycountChange(value){
        this.state.daycount = value;
    },

    render() {

        const { getFieldProps } = this.props.form;
        const nameProps = getFieldProps('username_reg', {
            rules: [
                {required: true, min: 5, message: '用户名至少为 5 个字符'}
            ],
        });
        const emailProps = getFieldProps('email_reg', {
            rules: [
                {required: true},
                {type: 'email', message: '请输入正确的邮箱地址'}
            ],
        });
        const email_logProps = getFieldProps('email_log', {
            rules: [
                {required: true},
                {type: 'email', message: '请输入正确的邮箱地址'}
            ],
        });
        const passwdProps = getFieldProps('password_reg', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请填写密码',
            },{
                validator: this.checkPass,
            }],
        });
        const passwd_logProps = getFieldProps('password_log', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请填写密码',
            }]
        });
        const rePasswdProps = getFieldProps('repassword_reg', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码',
            }, {
                validator: this.checkPass2,
            }],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };
        return (
            <div>
                <ButtonGroup>
                    <Button type="primary" onClick={this.handleLogin}> {localStorage.getItem('is_login') == 1 ? '注销' : '登录'} </Button>
                    <Button type="primary" onClick={this.handleRegAndSet}> {localStorage.getItem('is_login') == 1 ? '设置' : '注册'} </Button>
                </ButtonGroup>
                <Modal title="登录" visible={this.state.login_visible} onOk={this.handleLoginSubmit}
                       onCancel={this.hideLoginModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="邮箱"
                            hasFeedback>
                            <Input {...email_logProps} type="email" placeholder="请输入Email账户"/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            hasFeedback>
                            <Input {...passwd_logProps} type="password" autoComplete="off"
                                                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}/>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="注册" visible={this.state.register_visible} onOk={this.handleRegisterSubmit}
                       onCancel={this.hideRegisterModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                            hasFeedback>
                            <Input {...nameProps} placeholder="请输入用户名"/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="邮箱"
                            hasFeedback>
                            <Input {...emailProps} type="email" placeholder="请输入Email账户"/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            hasFeedback>
                            <Input {...passwdProps} type="password" autoComplete="off"
                                                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="确认密码:"
                            hasFeedback>
                            <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                                                      onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}/>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="设置" visible={this.state.set_visible} onOk={this.handleSetSubmit}
                       onCancel={this.hideSetModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="学习词库：">
                            <Select size="large" defaultValue="siji" onChange={this.handleWordtagChange}>
                                <Option value="siji">四级</Option>
                                <Option value="toefl">托福</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="每日学习量：">
                            <Select size="large" defaultValue="50" onChange={this.handleDaycountChange}>
                                <Option value="20">20</Option>
                                <Option value="50">50</Option>
                                <Option value="100">100</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    },
});

LoginForm = createForm()(LoginForm);
module.exports = LoginForm;