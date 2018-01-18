import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {hashHistory} from 'react-router';
import {default as _Header} from '../header';
// import Menu from '../menu';
import {axiosConfig} from '../utils/axiosConfig';
import {generateTree} from '../utils';

/**
 * Created by WangXue 2017/3/15.
 *
 * 主视图View
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            mode: 'inline',
            treeData: []
        };
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: !this.state.collapsed ? 'vertical' : 'inline'
        });
    } ;
    getMenuList= () => {
        axiosConfig.get('ud/menu')
            .then( (result)=> {
                let treeData = generateTree(result.data.data);
                this.setState({
                    treeData: treeData
                });
                let menuUrl = '';
                const loop = (data) => {
                    for (let i =0; i< data.length; i++) {
                        if (data[i].menuUrl && data[i].delFlag === 0) {
                            menuUrl = data[i].menuUrl;
                            break;
                        }
                        if (data[i].children) {
                            loop(data[i].children);
                        }
                        if (menuUrl !== '') {
                            break;
                        }
                    }
                };
                loop(treeData);
                if (sessionStorage.getItem('menuUrl') && sessionStorage.getItem('menuUrl') !== '') {
                    menuUrl = sessionStorage.getItem('menuUrl');
                }
                sessionStorage.setItem('menuUrl', menuUrl);
                hashHistory.push({
                    pathname: menuUrl
                });
            });
    };
    componentDidMount() {
        // this.getMenuList();
    }
    onMenuClick = (item) => {
        this.setState({ selId: item.key });
        if (item.item.props['url']) {
            sessionStorage.setItem('menuUrl',item.item.props['url'] );
            hashHistory.push({
                pathname: item.item.props['url']
            });
        }
    };
    render() {
        //菜单动态渲染
        const SubMenu = Menu.SubMenu;
        const {Header, Content, Sider} = Layout;
        return (
            <Layout>
                <Header>
                    <_Header/>
                </Header>
                <Layout>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        trigger={null}
                    >
                        <Menu
                            mode={this.state.mode}
                            onClick={this.onMenuClick}
                        >
                            <Menu.Item key="1" url='team'>协同</Menu.Item>
                            <Menu.Item key="2" url='training'>培训</Menu.Item>
                            <SubMenu key="3" title="人资">
                                <Menu.Item key="4" url='oa/management'>人事管理</Menu.Item>
                                <Menu.Item key="5" url='oa/salary'>工资单</Menu.Item>
                                <Menu.Item key="6" url='oa/check'>人事考核</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="8" url='contact'>通讯录</Menu.Item>
                            <Menu.Item key="9" url='settings'>设置</Menu.Item>
                            <Menu.Item key="10" url='service'>企业服务</Menu.Item>
                        </Menu>
                        <div className="amp-trigger"  onClick={this.toggle}>
                            <i className="fa-aligh"></i>
                        </div>
                    </Sider>
                    <Content>
                        <div className="amp-main">
                            {this.props.children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default App;
