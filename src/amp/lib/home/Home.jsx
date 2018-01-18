import React from 'react';
import {Icon} from 'antd';
import {hashHistory} from 'react-router';
import Constants from '../constants';
/*
 *select
 * */
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onMenuClick = (index, type) => {
        hashHistory.push({
            pathname: type
        });
    };
    onMenuAddClick = (event, type) => {
        if (type === 'upd') {
            window.open(Constants.UPD_URL, '_blank');
        } else if (type === 'umd') {
            window.open(Constants.UMD_URL, '_blank');
        }
    };

    render() {
        return (
            <div className="amp-home">
                <div className="amp-home-cell">
                    <div className="amp-home-logo">
                        <Icon type="layout"/>
                        <div className="">我的设计</div>
                    </div>
                    <div className="amp-home-child">
                        <Icon type="caret-right"/>
                        <span onClick={(event) => this.onMenuClick(event, 'upd')}>页面设计</span>
                        <div className="amp-home-add" onClick={(event) => this.onMenuAddClick(event, 'upd')}>
                            <Icon type="file-add"/>新增
                        </div>
                    </div>
                    <div className="amp-home-child">
                        <Icon type="caret-right"/>
                        <span onClick={(event) => this.onMenuClick(event, 'umd')}>模型设计</span>
                        <div className="amp-home-add" onClick={(event) => this.onMenuAddClick(event, 'umd')}>
                            <Icon type="file-add"/>新增
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        );
    }

}


