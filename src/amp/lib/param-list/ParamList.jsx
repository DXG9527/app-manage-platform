import React from 'react';
import {Button, Icon, Input, message, Popconfirm, Select} from 'antd';
import {hashHistory} from 'react-router';
import {format} from '../utils';
import DateRange from '../date-range';
import {axiosConfig} from '../utils/axiosConfig';
import Sort from '../sort';
import Pagination from '../pagination';

export default class ParamList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageParam: [],
            currentPage: 0,
            totalPages: 1,
            totalCount: 1,
            pageSize: 8,
            searchData: {  //提交时查询数据
                name: '',
                dataType:'',
                startTime: '',
                endTime: ''
            },
            term: {   //修改时时查询数据
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

    getListData = (page) => {
        let data = {
            page: page,
            size: this.state.pageSize,
            name: this.state.searchData.name,
            dataType: this.state.searchData.dataType,
            startTime: this.state.searchData.startTime,
            endTime: this.state.searchData.endTime,
            order: this.state.sort.order ? this.state.sort.order : 'createTime',
            direction: this.state.sort.order ? this.state.sort.direction : 'DESC' //用order 判断在于有可能某字段不排序
        };

        axiosConfig.get('/upd/platformparams', {
            params: data
        })
            .then((result) => {
                this.setState({
                    pageParam: result.data.data ? result.data.data : [],
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
    onDeleteClick = (event, id) => {
        axiosConfig.delete(`/upd/platformparams/${id}`)
            .then((result) => {
                message.destroy();
                if (result.data.success === true) {
                    message.success('删除成功');
                } else {
                    message.error(result.data.msg);
                }
                this.getListData(this.state.currentPage);
            });
    };
    onEditClick = (event, id) => {
        hashHistory.push({
            pathname: '/param/detail',
            state: {id: id,page:this.state.currentPage}
        });
    };
    onAddClick = (event) => {
        hashHistory.push({
            pathname: '/param/detail',
            state: {page:this.state.currentPage}
        });
    };
    onTitleChange = (event) => {
        this.state.term.name = event.target.value.trim();
    };
    onTypeChange = (value) =>{
        this.state.term.dataType = value;
    }
    onDateChange = (type, value) => {
        this.state.term[type] = value;
    };
    onSearchClick = (event) => {
        let o = {
            name: this.state.term.name,
            dataType:this.state.term.dataType,
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
        const Option = Select.Option;
        searchUi = <div className="amp-list-search">
            <div className="amp-search-term">
                <span>参数：</span>
                <Input placeholder="参数名称/key"
                    onChange={this.onTitleChange}/>
                <div className="clear"></div>
            </div>
            <div className="amp-search-term">
                <span>参数类型：</span>
                <Select defaultValue="" onChange={this.onTypeChange} >
                    <Option value="">全部</Option>
                    <Option value="String">String</Option>
                    <Option value="Number">Number</Option>
                    <Option value="Boolean">Boolean</Option>
                    <Option value="Date">Date</Option>
                </Select>
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
        if (this.state.pageParam.length > 0) {
            listUi = this.state.pageParam.map((item, index) => {
                return (
                    <div className="amp-list-row" key={index} data-id={item.id}>
                        <div className="amp-list-cell-col col-key">{item.name}</div>
                        <div className="amp-list-cell-col col-key" title={item.paramKey}>{item.paramKey}</div>
                        <div className="amp-list-cell-col col-num">{item.dataType ? item.dataType : '-'}</div>
                        <div className="amp-list-cell-col col-num">{item.referedNumber ? item.referedNumber : '0'}</div>
                        <div
                            className="amp-list-cell-col col-time">{format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</div>
                        <div className="amp-list-cell-col col-opt">
                            <Icon title="编辑" type="edit" onClick={(event) => this.onEditClick(event, item.id)}/>
                            <Popconfirm title="将会删除与该参数关联的组件参数，确定删除？"
                                onConfirm={(event) => this.onDeleteClick(event, item.id)}
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
                <div className="amp-list-cell-col col-key">
                    <Sort className="sort-style" title="参数名称" sortKey="name"
                        value={sort.order === 'name' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-key">
                    <Sort className="sort-style" title="参数key值" sortKey="paramKey"
                        value={sort.order === 'paramKey' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-num">
                    <Sort className="sort-style" title="参数类型" sortKey="dataType"
                        value={sort.order === 'dataType' ? sort.direction : ''}
                        onChange={this.onSortChange}/>
                    <div className="clear"></div>
                </div>
                <div className="amp-list-cell-col col-num">
                    关联次数
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
            listUi = <div className="amp-list-null">没有查询到符合条件的参数！</div>;
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
                <div className="amp-list-box amp-list-param">
                    <div className="amp-list-title">
                        系统管理<span>·</span>参数管理
                        <div className="amp-list-add" onClick={this.onAddClick}><Icon type="file-add"/>新增参数</div>
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
