import React from 'react';
import {hashHistory} from 'react-router';
import {Icon, Menu as _Menu} from 'antd';
import Constants from '../constants';
/*
 *select
 * */
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selId: '',
            treeData: props.treeData,
            openKeys:[]
        };
    }
    getSelecteMenu = (data) =>{
        const url = window.location.href;
        let select = {};
        let loop = (data) =>{
            for (let i =0; i< data.length; i++) {
                if (data[i].children) {
                    loop(data[i].children);
                }
                if (data[i].menuUrl && data[i].delFlag === 0) {
                    if(url.indexOf(data[i].menuUrl) != -1){
                        select.selId = data[i].menuId;
                        select.parentId = data[i].parentId;
                        break;
                    }
                }
                if(select.selId){
                    break;
                }
            }
        };
        loop(data);
        return select;
    }
    componentWillReceiveProps(nextProps){
        this.state.treeData = nextProps.treeData;
        let select = this.getSelecteMenu(nextProps.treeData);
        this.state.selId = select.selId;
        if(this.state.openKeys.indexOf(select.parentId) ==-1){
            this.state.openKeys.push(select.parentId);
        }
        if(nextProps.mode =='vertical'){
            this.state.openKeys = [];
        }
    }

    onMenuClick = (item) => {
        this.setState({ selId: item.key });
        if (item.item.props['data-url']) {
            sessionStorage.setItem('menuUrl',item.item.props['data-url'] );
            hashHistory.push({
                pathname: item.item.props['data-url']
            });
        }
    }
    onOpenChange = (openKeys) =>{
        this.setState({openKeys:openKeys});
    }
    getAncestorKeys = (key) => {
        const map = {
            sub3: ['sub2']
        };
        return map[key] || [];
    }
    render() {
        const SubMenu = _Menu.SubMenu;
        const {mode} = this.props;
        const loop = data => data.map((item) => {
            if (item.delFlag === 0) {
                if (item.children && item.children.length) {
                    return (
                        <SubMenu
                            key={item.menuId} title={<span><Icon type={item.iconType}/><span
                                className="nav-text">{item.menuName}</span></span>}
                        >
                            {loop(item.children)}
                        </SubMenu>
                    );
                }
                return (
                    <_Menu.Item key={item.menuId} data-url={item.menuUrl}>
                        <span>
                            <Icon type={item.iconType}/>
                            <span className="nav-text">{item.menuName}
                                <div className="amp-menu-tri"></div></span>
                        </span>
                    </_Menu.Item>
                );
            }
        });

        return (
            <_Menu theme="dark" mode={mode}
                selectedKeys={[this.state.selId]}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.onMenuClick}>
                {loop(this.state.treeData)}
            </_Menu>
        );
    }

}


