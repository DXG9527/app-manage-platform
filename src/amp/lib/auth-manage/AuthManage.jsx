import React, {Component} from 'react';
import {Tree, Button, message} from 'antd';
import AuthManageList from './AuthManageList';
import {axiosConfig} from '../utils/axiosConfig';
import {hashHistory} from 'react-router';
const TreeNode = Tree.TreeNode;
let treeData;
export default class AuthManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authItem: {},
            otherUserData: []
        };
        if (this.props.location && this.props.location.state) {
            if (this.props.location.state.treeData && this.props.location.state.otherUserData) {
                treeData = this.props.location.state.treeData;
                this.state.authItem = treeData[0];
                this.state.otherUserData = this.props.location.state.otherUserData;
            }
        }
    }

    userOptionsChange = (event) => {
        let otherUserData = this.state.otherUserData;
        let userId = event.target.value.userId;
        let existFlag = 0;
        let childIds = this.getChildItems(this.state.authItem.key, treeData);
        otherUserData.forEach((item) => {
            if (item.userId === userId) {
                existFlag = 1;
                if (item.umdId === this.state.authItem.key) {
                    item.execFlag = '0';
                    item.readFlag = event.target.checked ? '1' : '0';
                    item.writeFlag = event.target.checked ? '1' : '0';
                }
                childIds.forEach((childId) => {
                    if (item.umdId === childId) {
                        item.execFlag = '0';
                        item.readFlag = event.target.checked ? '1' : '0';
                        item.writeFlag = event.target.checked ? '1' : '0';
                    }
                });
            }
        });
        if (existFlag === 0) {
            if (this.props.location.state && this.props.location.state.thisUserData) {
                let newData = this.props.location.state.thisUserData;
                newData.forEach((item) => {
                    let cloneItem = Object.assign({}, item);
                    cloneItem.authId = '';
                    cloneItem.userId = userId;
                    cloneItem.execFlag = '0';
                    cloneItem.readFlag = event.target.checked ? '1' : '0';
                    cloneItem.writeFlag = event.target.checked ? '1' : '0';
                    otherUserData.push(cloneItem);
                });
            }
        }
        this.setState({otherUserData: otherUserData});
    };

    getChildItems = (itemId, treeData) => {
        let childIds = [];
        const loopTreeData = (data) => {
            data.forEach((treeItem) => {
                if (treeItem.key === itemId) {
                    if (treeItem.children && treeItem.children.length) {
                        loopChildren(treeItem.children);
                    }
                } else if (treeItem.children && treeItem.children.length) {
                    loopTreeData(treeItem.children);
                }
            });
        };
        const loopChildren = (data) => {
            data.forEach((childItem) => {
                childIds.push(childItem.key);
                if (childItem.children && childItem.children.length) {
                    loopChildren(childItem.children);
                }
            });
        };
        loopTreeData(treeData);
        return childIds;
    };

    authOptionsChange = (authOptions, userId) => {
        let otherUserData = this.state.otherUserData;
        let childIds = this.getChildItems(this.state.authItem.key, treeData);
        otherUserData.forEach((item) => {
            if (item.userId === userId) {
                if (item.umdId === this.state.authItem.key) {
                    item.execFlag = '0';
                    item.readFlag = (authOptions.indexOf('r') === -1) ? '0' : '1';
                    item.writeFlag = (authOptions.indexOf('w') === -1) ? '0' : '1';
                }
                childIds.forEach((childId) => {
                    if (item.umdId === childId) {
                        item.execFlag = '0';
                        item.readFlag = (authOptions.indexOf('r') === -1) ? '0' : '1';
                        item.writeFlag = (authOptions.indexOf('w') === -1) ? '0' : '1';
                    }
                });
            }
        });
        this.setState({otherUserData: otherUserData});
    };

    onTreeClick = (event, item) => {
        this.setState({
            authItem: item
        });
    };

    generateItem = (item) => {
        let users = this.props.location.state.users;
        let user = {};
        let getUser = (userId) => users.forEach((item) => {
            if (item.userId === userId) {
                user = item;
            }
        });
        let otherUserData = this.state.otherUserData;
        item.checkedUsers = [];
        item.authManageVisible = this.state.authItem.key && this.state.authItem.key === item.key;
        otherUserData.forEach((otherItem) => {
            let authOptions = [];
            if (otherItem.readFlag === '1') {authOptions.push('r');}
            if (otherItem.writeFlag === '1') {authOptions.push('w');}
            if (otherItem.execFlag === '1') {authOptions.push('x');}
            if (otherItem.umdId === item.key && (otherItem.readFlag === '1' || otherItem.writeFlag === '1' ||
                otherItem.execFlag === '1')) {
                getUser(otherItem.userId);
                user.authOptions = authOptions;
                let cloneUser = Object.assign({}, user);
                if (item.checkedUsers && item.checkedUsers.length > 0) {
                    if (item.checkedUsers.indexOf(cloneUser) === -1) {
                        item.checkedUsers.push(cloneUser);
                    }
                } else {
                    item.checkedUsers = [cloneUser];
                }
            }
        });
        let childIds = this.getChildItems(item.key, treeData);
        const loop = (data) => data.map((childItem) => {
            if (childIds.indexOf(childItem.key) !== -1) {
                childItem.authableUsers = item.checkedUsers;
            }
            if (childItem.children && childItem.children.length > 0) {
                loop(childItem.children);
            }
        });
        loop(treeData);
        return item;
    };

    handleOk = () => {
        axiosConfig.post('/umd/config/authList', this.state.otherUserData)
            .then((result) => {
                if (result.data.success === true) {
                    message.success('权限设置成功');
                }
            });
        hashHistory.push({
            pathname: '/umd'
        });
    };
    handleCancel = () => {
        hashHistory.push({
            pathname: '/umd'
        });
    };

    render() {
        const loop = (data) => data.map((item) => {
            let title = <span onClick={(event) => this.onTreeClick(event, item)}>{item.title}</span>;
            if (item.children && item.children.length) {
                return <TreeNode key={item.key} title={title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={title}/>;
        });

        const userOptions = (item) => {
            let className = item.authManageVisible ? '' : 'auth-manage-invisible';
            if (item.authableUsers && item.authableUsers.length > 0) {
                return item.authableUsers.map((user) => {
                    let userChecked = false, checkedOptions = [];
                    if (item.checkedUsers) {
                        item.checkedUsers.forEach((checkedUser) => {
                            if (checkedUser.userId === user.userId) {
                                userChecked = true;
                                checkedOptions = checkedUser.authOptions;
                            }
                        });
                    }
                    return (
                        <AuthManageList
                            key={`${user.userId}-${item.key}`}
                            type={item.type}
                            visible={className}
                            user={user}
                            checked={userChecked}
                            checkedOptions={checkedOptions}
                            authOptionsChange={(event) => this.authOptionsChange(event, user.userId)}
                            userOptionsChange={this.userOptionsChange}/>
                    );
                });
            } else {
                return (<div key={`${item.key}`} className={`${className} auth-manage-list`}>
                    <div className="auth-no-user">没有可选择的用户</div>
                </div>);
            }
        };

        let items = [];
        const loopAuth = (data) => {
            data.map((item) => {
                items.push(userOptions(this.generateItem(item)));
                if (item.children && item.children.length > 0) {
                    loopAuth(item.children);
                }
            });
            return items;
        };

        return (
            <div className="amp-widget">
                <div className="amp-widget-title">权限管理</div>
                <div className="amp-menu-content">
                    <div className="amp-menu-bottom">
                        <Button onClick={this.handleCancel}>取消</Button>
                        <Button type="primary" onClick={this.handleOk}>应用</Button>
                    </div>
                    <div className="auth-manage-layout auth-manage-tree">
                        <div className="auth-manage-title">设计目录</div>
                        <Tree showLine defaultExpandAll>
                            {loop(treeData)}
                        </Tree>
                    </div>
                    <div className="auth-manage-visible auth-manage-layout">
                        <div>
                            <div className="auth-manage-title">{`[${this.state.authItem.title}] 权限设置`}</div>
                            <div className="auth-manage-list auth-manage-list-header">
                                <div className="auth-user-title auth-manage-layout">用户</div>
                                <div className="auth-option-title auth-manage-layout">权限</div>
                                <div className="clear"></div>
                            </div>
                            <div className="auth-manage-layout">
                                {loopAuth(treeData)}
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }
}
