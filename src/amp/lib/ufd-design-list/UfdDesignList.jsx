import React from 'react';
import {Button, Icon, Input, message, Popconfirm} from 'antd';
import Constants from '../constants';
import DateRange from '../date-range';
import {format} from '../utils';
import {axiosConfig} from '../utils/axiosConfig';
import Sort from '../sort';
import Pagination from '../pagination';
import {hashHistory} from 'react-router';

export default class UfdDesignList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageDesign: [],
            currentPage: 0,
            totalPages: 1,
            type: 'ufd',
            totalCount: 1,
            userName: '',
            pageSize: 8,
            searchData: { //查询时查询数据
                title: '',
                startTime: '',
                endTime: ''
            },
            term: {   //修改时查询数据
                title: '',
                startTime: '',
                endTime: ''
            },
            sort: {
                order: 'createTime',
                direction: 'DESC'
            },
            loadState: false
        };
    }

    getListData = (page) => {
        let data = {
            page: page,
            size: this.state.pageSize,
            designTitle: this.state.searchData.title,
            startTime: this.state.searchData.startTime,
            endTime: this.state.searchData.endTime,
            order: this.state.sort.order ? this.state.sort.order : 'createTime',
            direction: this.state.sort.order ? this.state.sort.direction : 'DESC' //用order 判断在于有可能某字段不排序
        };
        axiosConfig.get('/ufd/config', {
            params: data
        })
            .then((result) => {
                this.setState({
                    pageDesign: result.data.data,
                    totalCount: result.data.pageable ? result.data.pageable.total : '',
                    currentPage: result.data.pageable ? result.data.pageable.pageNumber : '',
                    totalPages: result.data.pageable ? result.data.pageable.totalPages : '',
                    loadState: true
                });
            });
    };

    componentDidMount() {
        this.getListData(this.state.currentPage);
    }

    onPageChange = (page) => {
        this.getListData(page);
    };
    onDeleteClick = (event, designId) => {
        axiosConfig.delete(`/ufd/config/${designId}`)
            .then((result) => {
                message.destroy();
                message.success('删除成功');
                this.getListData(this.state.currentPage);
            });
    };
    onEditClick = (event, designId) => {
        let UFD_URL = Constants.UFD_URL;
        let index = UFD_URL.lastIndexOf('/');
        let str = UFD_URL.substring(index + 1, UFD_URL.length);
        let param = str.indexOf('?') != -1 ? '&_udId=' : '?_udId=';
        window.open(UFD_URL + param + designId, '_blank');
    };
    // onAuthManageClick = (event, designId) => {
    //     Object.keys(sessionStorage).map((key) => {
    //         if(key.indexOf('@@History/') !== -1) {
    //             sessionStorage.removeItem(key);
    //         }
    //     });
    //     let users;
    //     axiosConfig.get('/ud/login/getAllUsers')
    //         .then((result) => {
    //             users = result.data.data;
    //         });
    //     axiosConfig.get(`/ufd/config/authList/${designId}`)
    //         .then((result) => {
    //             if (result.data.data) {
    //                 let userId = sessionStorage.getItem('userId');
    //                 let thisUserData = [], otherUserData = [];
    //                 result.data.data.forEach((item) => {
    //                     if (item.userId === userId) {
    //                         thisUserData.push(item);
    //                     } else {
    //                         otherUserData.push(item);
    //                     }
    //                 });
    //
    //                 let treeData = this.generateUmdTree(thisUserData, users);
    //                 hashHistory.push({
    //                     pathname: '/ufd/authManage',
    //                     state: {treeData: treeData, users: users, thisUserData: thisUserData, otherUserData: otherUserData}
    //                 });
    //             }
    //         });
    // };
    onAddClick = (event) => {
        window.open(Constants.UFD_URL, '_blank');
    };
    onTitleChange = (event) => {
        this.state.term.title = event.target.value.trim();
    };
    onDateChange = (type, value) => {
        this.state.term[type] = value;
    };
    onSearchClick = (event) => {
        let o = {
            title: this.state.term.title,
            startTime: this.state.term.startTime,
            endTime: this.state.term.endTime
        };
        this.setState({searchData: o}, function () {
            this.getListData(0);
        });
    };
    onSortChange = (sortKey, value) => {
        const sort = {
            order: sortKey,
            direction: value
        };
        this.setState({sort: sort}, () => {
            this.getListData(this.state.currentPage);
        });
    };
    // generateUmdTree = (data, users) => {
    //     let treeData = [];
    //     let rootItem = {};
    //     let itemArr = [];
    //     if (data.length > 0) {
    //         data.forEach((item) => {
    //             let treeItem = {};
    //             treeItem.key = item.umdId;
    //             treeItem.type = item.umdType;
    //             if (item.umdType === 'DESIGN') {
    //                 treeItem.title = item.abstractResource.designTitle;
    //                 treeItem.parentId = null;
    //                 rootItem = treeItem;
    //                 rootItem.authableUsers = users;
    //             } else if (item.umdType === 'DIAGRAM' || item.umdType === 'DIRECTORY') {
    //                 treeItem.title = item.abstractResource.title;
    //                 treeItem.parentId = item.abstractResource.parentId;
    //             }
    //             if (itemArr.indexOf(treeItem) === -1) {
    //                 itemArr.push(treeItem);
    //             }
    //         });
    //     }
    //     const initChild = (parentItem, list, parentId) =>{
    //         list.forEach((item) => {
    //             if (item.parentId === parentId) {
    //                 if (parentItem.children && parentItem.children.length > 0) {
    //                     parentItem.children.push(item);
    //                 } else {
    //                     parentItem.children = [item];
    //                 }
    //                 initChild(item, list, item.key);
    //             }
    //         });
    //     };
    //     initChild(rootItem, itemArr, '');
    //     treeData.push(rootItem);
    //     return treeData;
    // };

    render() {
        let listUi = '', headUi = '', searchUi = '', ui = '';

        searchUi = <div className="amp-list-search">
            <div className="amp-search-term">
                <span>名称：</span>
                <Input placeholder="设计名称"
                    onChange={this.onTitleChange}/>
                <div className="clear"></div>
            </div>
            <div className="amp-search-term">
                <span>创建时间：</span>
                <DateRange onChange={this.onDateChange}/>
                <div className="clear"></div>
            </div>
            <div className="amp-search-term">
                <Button type="primary" icon="search" onClick={this.onSearchClick}>查询</Button>
            </div>
            <div className="clear"></div>
        </div>;
        if (this.state.pageDesign && this.state.pageDesign.length > 0) {
            listUi = this.state.pageDesign.map((item, index) => {
                // let authIcon = '';
                // if (item.execFlag === '1') {
                //     authIcon = <Icon title="权限管理" type="lock" onClick={(event) => this.onAuthManageClick(event, item.designId)}/>;
                // }
                return (
                    <div className="amp-list-row" key={index} data-id={item.designId}>
                        <div className="amp-list-cell-col col-title">{item.designTitle}</div>
                        <div
                            className="amp-list-cell-col col-type">{item.designType != 'null' ? item.designType : 'UFD'}</div>
                        <div className="amp-list-cell-col col-time">
                            {(item.updateTime && item.updateTime != 'null') ?
                                format(item.updateTime, 'yyyy-MM-dd hh:mm:ss') : format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                        <div className="amp-list-cell-col col-time">
                            {format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                        <div className="amp-list-cell-col col-opt">
                            {/*{authIcon}*/}
                            <Icon title="打开设计" type="eye-o" onClick={(event) => this.onEditClick(event, item.designId)}/>
                            <Popconfirm title="确定要删除该页面？"
                                onConfirm={(event) => this.onDeleteClick(event, item.designId)}
                                okText="确定" cancelText="取消">
                                <Icon title="删除" type="delete"/>
                            </Popconfirm>
                        </div>
                        <div className="clear"></div>
                    </div>
                );
            });
            let sort = this.state.sort;
            headUi = <div className="amp-list-head">
                <div className="amp-list-cell-col col-title">
                    <Sort className="sort-style" title="设计名称" sortKey="designTitle"
                        value={sort.order === 'designTitle' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-type">
                    设计类型
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-time">
                    <Sort className="sort-style" title="更新时间" sortKey="updateTime"
                        value={sort.order === 'updateTime' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-time">
                    <Sort className="sort-style" title="创建时间" sortKey="createTime"
                        value={sort.order === 'createTime' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="clear"></div>
            </div>;
        } else {
            listUi = <div className="amp-list-null">没有查询到符合条件的设计流程！</div>;
        }

        ui = <div className="amp-list">
            {searchUi}
            {headUi}
            {listUi}
            <Pagination pageSize={this.state.pageSize}
                currentPage={this.state.currentPage + 1}
                total={this.state.totalCount}
                showQuickJumper={true}
                totalPages={this.state.totalPages}
                onChange={this.onPageChange}/>
            <div className="clear"></div>
        </div>;
        if (this.state.loadState) {
            return (
                <div className="amp-list-box">
                    <div className="amp-list-title">
                        我的设计<span>·</span>流程设计
                        <div className="amp-list-add" onClick={this.onAddClick}><Icon type="file-add"/>新增设计</div>
                    </div>
                    {ui}
                </div>
            );
        } else {
            return (
                <div className="amp-list-loading">加载中...</div>
            );
        }
    }

}
