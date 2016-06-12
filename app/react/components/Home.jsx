import React, {Component} from 'react';
import {Menu, Breadcrumb} from 'antd';
import LoginForm from './Login.jsx';
import Word from './Word.jsx'
import './Home.css';


export default class Home extends Component {

    render() {
        return (
            <div>
                <div className="ant-layout-top">
                    <div className="ant-layout-header">
                        <div className="ant-layout-wrapper">
                            <div className="ant-layout-logo"></div>
                            <div className="ant-layout-user"><LoginForm /></div>
                            <Menu theme="dark" mode="horizontal"
                                  defaultSelectedKeys={['2']} style={{lineHeight: '64px'}}>
                                <Menu.Item key="1">导航一</Menu.Item>
                                <Menu.Item key="2">导航二</Menu.Item>
                                <Menu.Item key="3">导航三</Menu.Item>
                            </Menu>
                        </div>
                    </div>

                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-container">
                            <div style={{ height:'650px' }}>
                                <Word />
                            </div>
                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        gasxia@126.com
                    </div>
                </div>
            </div >
        )
    }
}