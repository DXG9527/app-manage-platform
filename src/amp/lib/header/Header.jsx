import React from 'react';
import {Popover} from 'antd';
import Constants from '../constants';
import {axiosConfig} from '../utils/axiosConfig';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme:props.theme
        };
    }

    onLogoutClick = (event) => {
        axiosConfig.get('/ud/logout',).then(
            function (result) {
                window.location.href = '#/';
            }
        );
        sessionStorage.removeItem('menuUrl');
        sessionStorage.removeItem('userId');
    };

    onThemeChange = (event, value) => {
        event.stopPropagation();
        let data = {
            configureData: {
                theme: value
            }
        };
        axiosConfig.post('ud/user/config',data);
        let themeCell = document.getElementsByClassName('theme-cell');
        for(let i=0;i<themeCell.length;i++){
            let temp = themeCell[i].className.split(' ');
            themeCell[i].className = temp[0] + ' ' + temp[1];
        }
        event.target.parentNode.className = event.target.parentNode.className + ' theme-focus';
        document.getElementById('app').className = 'theme-' + value;
    };

    componentDidMount() {
        this.setState({theme:'dark'});
        // axiosConfig.get('ud/user/config')
        //     .then((result) => {
        //         if (result.data.success === true && result.data.data[0]) {
        //             let jsonData = {};
        //             try{
        //                 jsonData = JSON.parse(result.data.data[0]);
        //             } catch (error) {
        //                 console.error(error);
        //             }
        //             document.getElementById('app').className = 'theme-' + (jsonData.theme ? jsonData.theme : 'light-black');
        //             this.setState({theme:jsonData.theme});
        //         }
        //     });
    }
    render() {
        let theme = Constants.THEME;
        const themeList =  theme.map((item,index)=>{
            let focus = '';
            if(item === this.state.theme){
                focus = 'theme-focus';
            }
            return <div key={index} className={`theme-cell ${item} ${focus}`}>
                <div onClick={(event) => this.onThemeChange(event, item)}></div>
            </div>;
        });
        const content = <div className="amp-theme">
            {themeList}
            <div className="clear"></div>
        </div>;
        return (
            <div className="amp-header">
                <div className="amp-header-name">
                    <i className="amp-header-logo ud-fa ud-fa-logo"/>
                    <div className="amp-header-title">UD</div>
                    <div className="clear"></div>
                </div>
                <div className="amp-header-user">
                    <div className="amp-user-name">
                        <i className="fa fa-user"></i>
                        <span>{sessionStorage.getItem('userId')}</span>
                    </div>
                    <Popover placement="bottomRight" arrowPointAtCenter title="主题选择" content={content} trigger="click">
                        <i className="fa fa-cog" title="主题选择"></i>
                    </Popover>
                    <i className="fa fa-sign-out" title="登出" onClick={this.onLogoutClick}></i>

                </div>
                <div className="clear"></div>
            </div>
        );
    }

}
