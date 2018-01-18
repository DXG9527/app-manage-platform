import React, {Component} from 'react';
import cfg from './config';
import {Popover} from 'antd';
import Constants from '../constants';
import {hashHistory} from 'react-router';
import {axiosConfig} from '../utils/axiosConfig';


class LoginCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userIdNull: false,
            passwordNull: false,
            errMsg: null
        };
    }

    componentDidMount () {
        if (sessionStorage.getItem('menuUrl') && sessionStorage.getItem('menuUrl') !== '') {
            hashHistory.push({
                pathname: '/app'
            });
        }
    }

    inputCheck = () => {
        let userId = this.refs.userId.value;
        let password = this.refs.password.value;
        if (userId === '') {
            this.setState({
                userIdNull: true,
                passwordNull: false,
                errMsg: cfg.errorText.userIdError.zhCN
            });
            return;
        }
        if (password === '') {
            this.setState({
                userIdNull: false,
                passwordNull: true,
                errMsg: cfg.errorText.passwordError.zhCN
            });
            return;
        }
        if (userId === password) {
            hashHistory.push({
                pathname: '/app'
            });
        }
        // axiosConfig.get('/ud/login', {
        //     params: {
        //         userName: userId,
        //         password: password
        //     }
        // })
        //     .then((result) => {
        //         if (result.data.errorCode === 500) {
        //             this.setState({
        //                 userIdNull: false,
        //                 passwordNull: true,
        //                 errMsg: result.data.msg
        //             });
        //         } else {
        //             sessionStorage.setItem('menuUrl', '');
        //             sessionStorage.setItem('userId', userId);
        //             hashHistory.push({
        //                 pathname: '/app'
        //             });
        //
        //         }
        //     });
    };

    handlerKeyUp = (event) => {
        if (event.keyCode === 13) {
            this.inputCheck();
        }
    };
    onFocus = (event, type) => {
        this.setState({
            userIdNull: false,
            passwordNull: false
        });
    };

    render() {
        let content = <p className="form-error"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{this.state.errMsg}</p>;

        return (
            <form noValidate='true'>
                <div className="form-group">
                    <Popover
                        content={content}
                        placement="bottomLeft"
                        trigger="click"
                        arrowPointAtCenter
                        visible={this.state.userIdNull}
                    >
                        <input className='form-input'
                            ref='userId' type='text'
                            placeholder={cfg.hint.userId.zhCN}
                            onKeyUp={this.handlerKeyUp}
                            onFocus={this.onFocus}
                            defaultValue={Constants.USER_NAME}></input>
                    </Popover>
                </div>
                <div className="form-group">
                    <Popover
                        content={content}
                        placement="bottomLeft"
                        trigger="click"
                        arrowPointAtCenter
                        visible={this.state.passwordNull}
                    >
                        <input className='form-input'
                            ref='password'
                            type='password'
                            placeholder={cfg.hint.password.zhCN}
                            onKeyUp={this.handlerKeyUp}
                            onFocus={this.onFocus}
                            defaultValue={Constants.PASSWORD}></input>
                    </Popover>
                </div>
                <button type='button' className='form-button' onClick={this.inputCheck}>{cfg.signIn.zhCN}</button>
            </form>
        );
    }
}

export default LoginCheck;
