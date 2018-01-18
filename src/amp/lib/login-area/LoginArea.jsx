import React, {Component} from 'react';
import Logo from './Logo';
import LoginCheck from './LoginCheck';
import cfg from './config';

class LoginArea extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='ud-app-view'>
                <div className='amp-login-area'>
                    <Logo/>
                    <div className={'amp-text-style text-center'}>管理平台</div>
                    <LoginCheck/>
                </div>
            </div>
        );
    }
}

export default LoginArea;
