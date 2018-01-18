import React from 'react';
import { Button, Icon, Input, message, Popconfirm, Select } from 'antd';
import { axiosConfig } from '../utils/axiosConfig';
import { hashHistory } from 'react-router';
import Constants from '../constants';
import { format, getLimitWord } from '../utils';
import DateRange from '../date-range';
import Sort from '../sort';
import Pagination from '../pagination';


export default class DesignList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageWidget: [],
            currentPage: 0,
            totalPages: 1,
            totalCount: 1,
            pageSize: 8,
            searchData: {
                name: '',
                startTime: '',
                endTime: '',
                loadType: '',
                isUse: ''
            },
            term: {
                name: '',
                startTime: '',
                endTime: ''
            },
            sort: {
                order: 'createTime',
                direction: 'DESC'
            },
            loadState: false
        };
        if (this.props.location && this.props.location.state && this.props.location.state.page) {
            this.state.currentPage = this.props.location.state.page; //返回的时候取得page
        }
    }

    getListData = (page, sort) => {
        let data = {
            page: page,
            size: this.state.pageSize,
            name: this.state.searchData.name,
            startTime: this.state.searchData.startTime,
            endTime: this.state.searchData.endTime,
            loadType: this.state.searchData.loadType,
            isUse: this.state.searchData.isUse,
            order: this.state.sort.order ? this.state.sort.order : 'createTime',
            direction: this.state.sort.order ? this.state.sort.direction : 'DESC' //用order 判断在于有可能某字段不排序
        };

        axiosConfig.get('/upd/component', {
            params: data
        })
            .then((result) => {
                this.setState({
                    pageWidget: result.data.data ? result.data.data : [],
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
    onDeleteClick = (event, prototypeId) => {
        axiosConfig.delete(`/upd/component/${prototypeId}`)
            .then((result) => {
                message.destroy();
                message.success('删除成功');
                this.getListData(this.state.currentPage);
            });
    };
    onEditClick = (event, prototypeId) => {
        hashHistory.push({
            pathname: '/widget/detail',
            state: { prototypeId: prototypeId, page: this.state.currentPage }
        });
    };
    onParamEditClick = (event, prototypeId, name) => {
        hashHistory.push({
            pathname: '/widget/setting',
            state: { prototypeId: prototypeId, name: name, page: this.state.currentPage }
        });
    };
    onAddClick = (event) => {
        hashHistory.push({
            pathname: '/widget/detail',
            state: { page: this.state.currentPage }
        });
    };
    onNameChange = (event) => {
        this.state.term.name = event.target.value.trim();
    };

    onLoadTypeChange = (value) => {
        this.state.term.loadType = value.trim();
    };
    onIsUseChange = (value) => {
        this.state.term.isUse = value.trim();
    };
    onDateChange = (type, value) => {
        this.state.term[type] = value;
    };
    onSearchClick = (event) => {
        let o = {
            name: this.state.term.name,
            startTime: this.state.term.startTime,
            endTime: this.state.term.endTime,
            loadType: this.state.term.loadType,
            isUse: this.state.term.isUse
        };
        this.setState({ searchData: o }, function () {
            this.getListData(0);
        });
    };
    onSortChange = (sortKey, value) => {
        const sort = {
            order: sortKey,
            direction: value
        };
        this.setState({ sort: sort }, () => {
            this.getListData(this.state.currentPage);
        });
    };
    onPreviewClick = (event, prototypeId) => {
        let ULR = Constants.COMPONENT_PREVIEW_URL;
        var index = ULR.lastIndexOf('/');
        var str = ULR.substring(index + 1, ULR[0].length);
        var param = str.indexOf('?') != -1 ? '&componentId=' : '?componentId=';
        window.open(ULR + param + prototypeId, '_blank');
    };
    render() {
        let listUi = '', headUi = '', searchUi = '', ui = '';
        const Option = Select.Option;

        searchUi = <div className="amp-list-search">
            <div className="amp-search-term">
                <span>名称：</span>
                <Input placeholder="组件名称"
                    onChange={this.onNameChange} />
                <div className="clear"></div>
            </div>
            <div className="amp-search-term">
                <span>加载类型：</span>
                <Select defaultValue="" onSelect={this.onLoadTypeChange}>
                    <Option value="">全部</Option>
                    <Option value="script">JavaScript</Option>
                    <Option value="react">React</Option>
                    <Option value="ajax">Ajax</Option>
                    <Option value="iframe">Iframe</Option>
                </Select>
            </div>
            <div className="amp-search-term">
                <span>创建时间：</span>
                <DateRange onChange={this.onDateChange} />
                <div className="clear"></div>
            </div>
            <div className="amp-search-term">
                <span>状态：</span>
                <Select defaultValue="" onSelect={this.onIsUseChange}>
                    <Option value="">全部</Option>
                    <Option value="true">启用</Option>
                    <Option value="false">禁用</Option>
                </Select>
            </div>
            <div className="amp-search-term">
                <Button type="primary" icon="search" onClick={this.onSearchClick}>查询</Button>
            </div>
            <div className="clear"></div>
        </div>;
        if (this.state.pageWidget.length > 0) {
            listUi = this.state.pageWidget.map((item, index) => {
                return (
                    <div className="amp-list-row" key={index} data-id={item.prototypeId}>
                        <div className="amp-list-cell-col col-title">{item.name}</div>
                        <div className="amp-list-cell-col col-loadtype">{item.loadType}</div>
                        <div className="amp-list-cell-col col-des"
                            title={item.description}>{getLimitWord(item.description)}</div>
                        <div className="amp-list-cell-col col-state">{item.sortNumber ? item.sortNumber : 1}</div>
                        <div
                            className="amp-list-cell-col col-time">{format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</div>
                        <div className="amp-list-cell-col col-opt">
                            <Icon title="编辑" type="edit"
                                onClick={(event) => this.onEditClick(event, item.prototypeId)} />
                            <i title="参数设置" className="fa fa-table"
                                onClick={(event) => this.onParamEditClick(event, item.prototypeId, item.name)}></i>
                            <Popconfirm title="确定要删除该组件？"
                                onConfirm={(event) => this.onDeleteClick(event, item.prototypeId)}
                                okText="确定" cancelText="取消">
                                <Icon title="删除" type="delete" />
                            </Popconfirm>
                            <Icon title="预览" type="eye-o"
                                onClick={(event) => this.onPreviewClick(event, item.prototypeId)} />
                        </div>
                        <div className="clear"></div>
                    </div>
                );
            });
            let sort = this.state.sort;
            headUi = <div className="amp-list-head">
                <div className="amp-list-cell-col col-title">
                    <Sort className="sort-style" title="组件名称" sortKey="name"
                        value={sort.order === 'name' ? sort.direction : ''}
                        onChange={this.onSortChange} />
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-loadtype">
                    <Sort className="sort-style" title="加载类型" sortKey="loadType"
                        value={sort.order === 'loadType' ? sort.direction : ''}
                        onChange={this.onSortChange} />
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-des">
                    <Sort className="sort-style" title="组件描述" sortKey="description"
                        value={sort.order === 'description' ? sort.direction : ''}
                        onChange={this.onSortChange} />
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-state">
                    <Sort className="sort-style" title="组件排序" sortKey="sortNumber"
                        value={sort.order === 'sortNumber' ? sort.direction : ''}
                        onChange={this.onSortChange} />
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-time">
                    <Sort className="sort-style" title="创建时间" sortKey="createTime"
                        value={sort.order === 'createTime' ? sort.direction : ''}
                        onChange={this.onSortChange} />
                    <div className="clear"></div>
                </div>
                <div className="clear"></div>
            </div>;
        } else {
            listUi = <div className="amp-list-null">没有查询到符合条件的组件！</div>;
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
                onChange={this.onPageChange} />
            <div className="clear"></div>
        </div>;
        if (this.state.loadState) {
            return (
                <div className="amp-list-box amp-list-widget">
                    <div className="amp-list-title">
                        系统管理<span>·</span>组件管理
                        <div className="amp-list-add" onClick={this.onAddClick}><Icon type="file-add" />新增组件</div>
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
