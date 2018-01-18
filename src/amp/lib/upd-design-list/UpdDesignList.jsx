import React from 'react';
import {Button, Icon, Input, message, Popconfirm} from 'antd';
import Constants from '../constants';
import DateRange from '../date-range';
import {format} from '../utils';
import {axiosConfig} from '../utils/axiosConfig';
import Sort from '../sort';
import Pagination from '../pagination';

export default class UpdDesignList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageDesign: [],
            currentPage: 0,
            totalPages: 1,
            type: 'upd',
            totalCount: 1,
            userName: '',
            pageSize: 8,
            searchData: {
                title: '',
                startTime: '',
                endTime: ''
            },
            term: {
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

    getListData = (page, sort) => {
        let data = {
            page: page,
            size: this.state.pageSize,
            designTitle: this.state.searchData.title,
            startTime: this.state.searchData.startTime,
            endTime: this.state.searchData.endTime,
            order: this.state.sort.order ? this.state.sort.order : 'createTime',
            direction: this.state.sort.order ? this.state.sort.direction : 'DESC' //用order 判断在于有可能某字段不排序
        };

        axiosConfig.get('/upd/config', {
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
        axiosConfig.delete(`/upd/config/${designId}`)
            .then((result) => {
                message.destroy();
                message.success('删除成功');
                this.getListData(this.state.currentPage);
            });
    };
    onEditClick = (event, designId) => {
        let UPD_URL = Constants.UPD_URL;
        var index = UPD_URL.lastIndexOf('/');
        var str = UPD_URL.substring(index + 1, UPD_URL[0].length);
        var param = str.indexOf('?') != -1 ? '&_udId=' : '?_udId=';
        window.open(UPD_URL + param + designId, '_blank');
    };

    onPreviewClick = (event, designId) => {
        let UPD_PREVIEW_URL = Constants.UPD_PREVIEW_URL;
        var index = UPD_PREVIEW_URL.lastIndexOf('/');
        var str = UPD_PREVIEW_URL.substring(index + 1, UPD_PREVIEW_URL[0].length);
        var param = str.indexOf('?') != -1 ? '&_udId=' : '?_udId=';
        window.open(UPD_PREVIEW_URL + param + designId, '_blank');
    };

    onAddClick = (event) => {
        window.open(Constants.UPD_URL, '_blank');
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
                return (
                    <div className="amp-list-row" key={index} data-id={item.designId}>
                        <div className="amp-list-cell-col col-title">{item.designTitle}</div>
                        <div
                            className="amp-list-cell-col col-type">{item.designType != 'null' ? item.designType : 'UPD'}</div>
                        <div className="amp-list-cell-col col-time">
                            {(item.updateTime && item.updateTime != 'null') ? format(item.updateTime, 'yyyy-MM-dd hh:mm:ss') : format(item.createdTime, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                        <div className="amp-list-cell-col col-time">
                            {format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                        <div className="amp-list-cell-col col-opt">
                            <Icon title="编辑" type="edit" onClick={(event) => this.onEditClick(event, item.designId)}/>
                            <Popconfirm title="确定要删除该页面？"
                                onConfirm={(event) => this.onDeleteClick(event, item.designId)}
                                okText="确定" cancelText="取消">
                                <Icon title="删除" type="delete"/>
                            </Popconfirm>
                            <Icon title="预览" type="eye-o"
                                onClick={(event) => this.onPreviewClick(event, item.designId)}/>
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
            //判断当前是否是查询数据为空
            listUi = <div className="amp-list-null">没有查询到符合条件的设计页面！</div>;
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
                        我的设计<span>·</span>页面设计
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
