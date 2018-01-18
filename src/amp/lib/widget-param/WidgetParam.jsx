import React from 'react';
import {Button, Checkbox, Icon, Input, message, Modal, Pagination, Popconfirm, Select} from 'antd';
import {axiosConfig} from '../utils/axiosConfig';
import {hashHistory} from 'react-router';

export default class WidgetParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prototypeId: '', //id
            name: '',
            page:0, //返回列表时的页码
            currentPage: 0,
            totalPages: 1,
            totalCount: 1,
            pageSize: 10,
            disabled: false, // 保存连点问题
            visible: false,//成功提示
            paramData: [], //平台参数
            widgetData: [], //组件参数
            searchData: {
                name: '',
                paramKey: ''
            },//查询分页信息
            checkedId: [], //已选择的platform_param_id
            checkedData: [], //已选择的数据
            hasDftKey: [] //已存在的key值
        };
        if (this.props.location && this.props.location.state ) {
            if(this.props.location.state.prototypeId){
                this.state.prototypeId = this.props.location.state.prototypeId;
                this.state.name = this.props.location.state.name;
            }
            if(this.props.location.state.page){
                this.state.page = this.props.location.state.page;
            }
        }
    }

    componentDidMount() {
        this.getWidgetParam();
        this.getParamListData(this.state.currentPage);
    }

    getWidgetParam = () => {
        axiosConfig.get(`/upd/parammapping/${this.state.prototypeId}`)
            .then((result) => {
                let checkedData = result.data.data ? result.data.data : [];
                let checkedId = [];
                checkedData.map((item) => {
                    checkedId.push(item.updPlatformParam.id);
                });
                this.setState({checkedData: checkedData, checkedId: checkedId});
            });
    };
    getParamListData = (page) => {
        let data = {
            page: page,
            size: this.state.pageSize
        };
        if (this.state.searchData.name) {
            data.name = this.state.searchData.name;
        }
        if (this.state.searchData.paramKey) {
            data.paramKey = this.state.searchData.paramKey;
        }
        axiosConfig.get('/upd/platformparams', {
            params: data
        })
            .then((result) => {
                //处理当前数据的id为platform_param_id
                let data = result.data.data ? result.data.data : [];
                let paramData = [];
                paramData = data.map((item) => {
                    let temp = {};
                    temp.id = item.id;
                    temp.name = item.name;
                    temp.paramKey = item.paramKey;
                    temp.dataType = item.dataType;
                    temp.format = item.format;
                    return temp;
                });
                this.setState({
                    paramData: paramData,
                    totalCount: result.data.pageable ? result.data.pageable.total : '',
                    currentPage: result.data.pageable ? result.data.pageable.pageNumber : '',
                    totalPages: result.data.pageable ? result.data.pageable.totalPages : '',
                    loadState: true
                });
            });
    };
    onPageChange = (page) => {
        const _page = page - 1;
        if (_page != this.state.currentPage) {
            this.getParamListData(_page);
        }
    };
    onSearchClick = (event) => {
        this.getParamListData(0);
    };
    onSearchDataChange = (event, key) => {
        this.state.searchData[key] = event.target.value.trim();
    };
    onParamCheck = (event, index) => {
        let checkedId = this.state.checkedId;
        let checkedData = this.state.checkedData;
        let paramData = this.state.paramData;
        let checkedAll = false;
        if (event.target.checked) {
            //index -1 即为选择了所有
            if (index === '-1') {
                this.state.paramData.map((item) => {
                    if (checkedId.indexOf(item.id) === -1) {
                        checkedId.push(item.id);
                        let temp = {};
                        temp.format = item.format;
                        temp.dataType = item.dataType;
                        temp.isIn = true;
                        temp.isOut = true;
                        temp.updPlatformParam = item;
                        temp.dftKey = item.paramKey;
                        checkedData.push(temp);
                    }
                    checkedAll = true;
                });

            } else {
                const temp = this.state.paramData[index];
                if (checkedId.indexOf(temp.id) === -1) {
                    checkedId.push(temp.id);
                    checkedData.push({
                        format: temp.format,
                        dataType: temp.dataType,
                        isIn: true,
                        isOut: true,
                        dftKey: temp.paramKey,
                        updPlatformParam: temp
                    });
                }
            }
        } else {//取消操作
            //index -1 即为选择了所有
            if (index === '-1') {
                this.state.paramData.map((item) => {
                    checkedId.splice(checkedId.indexOf(item.id), 1);
                    for (let i = 0; i < checkedData.length;) {
                        if (item.id === checkedData[i].updPlatformParam.id) {
                            if (checkedData[i].hasOwnProperty('id')) {
                                if (!checkedData[i].delFlag) {
                                    checkedData[i].delFlag = 1;
                                    break;
                                }
                            } else {
                                checkedData.splice(i, 1);
                                break;
                            }
                        }
                        i++;
                    }
                });

            } else {
                checkedId.splice(checkedId.indexOf(this.state.paramData[index].id), 1);
                for (let i = 0; i < checkedData.length;) {
                    if (this.state.paramData[index].id === checkedData[i].updPlatformParam.id) {
                        if (checkedData[i].hasOwnProperty('id')) {
                            if (!checkedData[i].delFlag) {
                                checkedData[i].delFlag = 1;
                                break;
                            }
                        } else {
                            checkedData.splice(i, 1);
                            break;
                        }
                    }
                    i++;
                }
            }
        }
        this.setState({
            checkedId: checkedId,
            checkedData: checkedData,
            paramData: paramData
        });
    };
    onEditInputChange = (event, index, key) => {
        let checkedData = this.state.checkedData;
        checkedData[index][key] = event.target.value.trim();
        this.setState({checkedData: checkedData});
    };
    onEditCheckChange = (event, index, key) => {
        let checkedData = this.state.checkedData;
        checkedData[index][key] = event.target.checked;
        this.setState({checkedData: checkedData});
    };
    onEditSelectChange = (value, index, key) => {
        console.log(value);
        let checkedData = this.state.checkedData;
        checkedData[index][key] = value;
        this.setState({checkedData: checkedData});
    };

    onDeleteClick = (event, index) => {
        let checkedData = this.state.checkedData;
        let checkedId = this.state.checkedId;
        let paramData = this.state.paramData;
        if (index !== '-1') {
            checkedId.splice(checkedId.indexOf(checkedData[index].updPlatformParam.id), 1);
            if (checkedData[index].hasOwnProperty('id') && checkedData[index] !== '') {
                checkedData[index].delFlag = 1;
            } else {
                checkedData.splice(index, 1);
            }

        } else {
            for (let i = 0; i < checkedData.length;) {
                checkedId.splice(checkedId.indexOf(checkedData[i].updPlatformParam.id), 1);
                if (checkedData[i].hasOwnProperty('id')) {
                    checkedData[i].delFlag = 1;
                    i++;
                } else {
                    checkedData.splice(i, 1);
                }
            }
        }
        this.setState({
            checkedId: checkedId,
            checkedData: checkedData ? checkedData : [],
            paramData: paramData
        });
    };
    onParamSaveClick = (event) => {
        this.setState({disabled: true}, () => {
            for (var i = 0; i < this.state.checkedData.length; i++) {
                if (!this.state.checkedData[i].hasOwnProperty('dftKey') || this.state.checkedData[i].dftKey === '') {
                    message.error('请完善已选择的参数key');
                    this.setState({disabled: false});
                    return;
                } else {
                    for (let j = 0; j < this.state.hasDftKey.length; j++) {
                        if (this.state.checkedData[i].delFlag !== 1) {
                            if (this.state.hasDftKey[j] === this.state.checkedData[i].dftKey && i !== j) {
                                message.error('key值存在重复！');
                                this.setState({disabled: false});
                                return;
                            }
                        }
                    }
                }
            }
            axiosConfig.post(`/upd/parammapping/${this.state.prototypeId}`, {paramMappings: this.state.checkedData})
                .then((result) => {
                    this.setState({visible: true});
                    setTimeout(() => {
                        this.setState({disabled: false, visible: false});
                        hashHistory.push({
                            pathname: '/widget',
                            state:{page:this.state.page}
                        });
                    }, 2000);
                })
                .catch((error) => {
                    this.setState({disabled: false});
                });
        });
    };
    onCancelClick = (event) => {
        hashHistory.push({
            pathname: '/widget',
            state:{page:this.state.page}
        });
    }

    render() {
        let pageUi = '';
        let checkValue = true;
        let checkedAll = false;
        if (this.state.paramData.length > 0) {
            checkedAll = true;
        }
        const Option = Select.Option;
        let paramUi = this.state.paramData.map((item, index) => {
            if (this.state.checkedId.indexOf(item.id) !== -1) {
                checkValue = true;
            } else {
                checkValue = false;
                checkedAll = false;
            }
            return <div className="amp-param-list-cell" key={index}>
                <div className="amp-param-opt"><Checkbox checked={checkValue}
                    onChange={(event) => this.onParamCheck(event, index)}></Checkbox>
                </div>
                <div className="amp-param-raw">{item.name}</div>
                <div className="amp-param-raw">{item.paramKey}</div>
                <div className="clear"></div>
            </div>;
        });
        if (this.state.totalPages > 1) {
            pageUi = <div className="amp-param-page">
                <Pagination pageSize={this.state.pageSize}
                    defaultCurrent={this.state.currentPage + 1}
                    total={this.state.totalCount}
                    size="small"
                    onChange={this.onPageChange}/>
                <div className="clear"></div>
            </div>;

        }
        let headStyle = {};
        if (this.state.checkedData.length > 13) {
            headStyle = {'paddingRight': '17px'};
        }
        this.state.hasDftKey = [];
        const widgetParamUi = this.state.checkedData.map((item, index) => {
            //存储 hasDftKey；
            if (item.dftKey !== '') {
                if (item.hasOwnProperty('delFlag') && item.delFlag == 1) {
                    this.state.hasDftKey.push('');
                } else {
                    this.state.hasDftKey.push(item.dftKey);
                }
            }
            //判断是否是删除状态
            if (item.hasOwnProperty('delFlag') && item.delFlag == 1) {
                return '';
            }

            return <div className="amp-param-list-cell" key={index}>
                <div className="amp-param-opt">
                    <Popconfirm title="确定要删除该参数？"
                        onConfirm={(event) => this.onDeleteClick(event, index)}
                        okText="确定" cancelText="取消">
                        <Icon title="删除" type="delete"/>
                    </Popconfirm>
                </div>
                <div className="amp-param-raw">{item.updPlatformParam.name}</div>
                <div className="amp-param-raw">{item.updPlatformParam.dataType}</div>
                <div className="amp-param-raw">
                    <Input onChange={(event) => this.onEditInputChange(event, index, 'dftKey')}
                        defaultValue={item.dftKey}/>
                </div>
                <div className="amp-param-state">
                    <Checkbox onChange={(event) => this.onEditCheckChange(event, index, 'isIn')}
                        defaultChecked={item.isIn}></Checkbox>
                </div>
                <div className="amp-param-state">
                    <Checkbox onChange={(event) => this.onEditCheckChange(event, index, 'isOut')}
                        defaultChecked={item.isOut}></Checkbox>
                </div>
                <div className="amp-param-raw">
                    <Select value={item.dataType}
                        onChange={(value) => this.onEditSelectChange(value, index, 'dataType')}>
                        <Option value="String">String</Option>
                        <Option value="Number">Number</Option>
                        <Option value="Boolean">Boolean</Option>
                        <Option value="Date">Date</Option>
                    </Select>
                </div>
                <div className="amp-param-raw">
                    <Input onChange={(event) => this.onEditInputChange(event, index, 'format')}
                        defaultValue={item.format}/>
                </div>
                <div className="clear"></div>
            </div>;

        });
        let allDelUi = '';
        if (this.state.checkedId.length !== 0) {
            allDelUi = <Popconfirm title="确定要全部删除？"
                onConfirm={(event) => this.onDeleteClick(event, '-1')}
                okText="确定" cancelText="取消">
                <Icon title="全部删除" type="delete"/>
            </Popconfirm>;
        } else {
            allDelUi = <Icon title="全部删除" type="delete"/>;
        }
        let nameUi = this.state.name ? `（${this.state.name}）` : '';

        return (
            <div className="amp-widget">
                <div className="amp-widget-title">系统管理<span>·</span>组件{nameUi}<span>·</span>参数设置</div>
                <div className="amp-param">
                    <div className="amp-param-left">
                        <div className="amp-setting-title">平台参数</div>
                        <div className="amp-setting-term">
                            参数名称：<Input onChange={(event) => this.onSearchDataChange(event, 'name')}/>
                            <Button onClick={this.onSearchClick}>查询</Button>
                        </div>
                        <div className="amp-param-list">
                            <div className="amp-param-head">
                                <div className="amp-param-list-cell">
                                    <div className="amp-param-opt">
                                        <Checkbox checked={checkedAll}
                                            onChange={(event) => this.onParamCheck(event, '-1')}></Checkbox>
                                    </div>
                                    <div className="amp-param-raw">参数名称</div>
                                    <div className="amp-param-raw">参数key</div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="amp-param-content">
                                {paramUi}
                            </div>
                            {pageUi}
                        </div>

                    </div>
                    <div className="amp-param-right">
                        <div className="amp-setting-title">组件参数</div>
                        <div className="amp-param-list">
                            <div className="amp-param-head" style={headStyle}>
                                <div className="amp-param-list-cell">
                                    <div className="amp-param-opt">
                                        {allDelUi}
                                    </div>
                                    <div className="amp-param-raw">平台参数名称</div>
                                    <div className="amp-param-raw">参数类型类型</div>
                                    <div className="amp-param-raw">组件参数key</div>
                                    <div className="amp-param-state">是否组件传入</div>
                                    <div className="amp-param-state">是否平台传出</div>
                                    <div className="amp-param-raw">数据类型</div>
                                    <div className="amp-param-raw">参数格式</div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="amp-param-content">
                                {widgetParamUi}
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div className="amp-param-bottom">
                        <Button onClick={this.onCancelClick} size="large">取消</Button>
                        <Button disabled={this.state.disabled} onClick={this.onParamSaveClick} size="large"
                            type="primary">保存设置</Button>
                    </div>
                </div>
                <Modal visible={this.state.visible} title="" width={250} closable={false} footer={null}
                    maskClosable={false}>
                    <div className="success-title">保存成功!</div>
                    <div>2秒后自动跳转到列表...</div>
                </Modal>
            </div>
        );
    }
}
