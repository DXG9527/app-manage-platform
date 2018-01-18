import React from 'react';
import {Upload, message, Icon, Button, Checkbox, Form, Input, InputNumber, Modal, Select} from 'antd';
import {axiosConfig} from '../utils/axiosConfig';
import {hashHistory} from 'react-router';

import Constants from '../constants';

const {API_BASE_URL} = Constants;
const IMG_URL = API_BASE_URL + 'upd/image';
class _WidgetDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            prototypeId: '',
            disabled: false,
            visible: false,
            typeShow:false,
            page:0
        };
        if (this.props.location && this.props.location.state && this.props.location.state.page) {
            this.state.page = this.props.location.state.page;
        }
    }

    onSubmit = (e) => {
        const me = this;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                me.setState({disabled: true});
                let {page, data, prototypeId} = me.state;
                let {updComponentImage} = data;
                console.log('1', updComponentImage);
                if (updComponentImage) {
                    Object.assign(values, {updComponentImage});
                }
                if (prototypeId !== '') {
                    values.prototypeId = prototypeId;
                } else {
                    page = 0;
                }
                axiosConfig.post('/upd/component', values)
                    .then((result) => {
                        me.setState({visible: true});
                        setTimeout(() => {
                            me.setState({disabled: false, visible: false});
                            hashHistory.push({
                                pathname: '/widget',
                                state: {page}
                            });
                        }, 2000);
                    })
                    .catch((error) => {
                        me.setState({disabled: false});
                    });
            }
        });
    };
    onCancelClick = (event) => {
        hashHistory.push({
            pathname: '/widget',
            state:{page:this.state.page}
        });
    };

    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.prototypeId) {
            axiosConfig.get(`/upd/component/${this.props.location.state.prototypeId}`)
                .then((result) => {
                    if (result.data.data) {
                        let typeShow = true;
                        if(result.data.data[0].loadType=='script' || result.data.data[0].loadType=='react'){
                            typeShow = true;
                        }else{
                            typeShow = false;
                        }
                        this.setState({
                            data: result.data.data[0],
                            typeShow:typeShow,
                            prototypeId: this.props.location.state.prototypeId
                        });
                    }
                });
        }else{
            //新增时为true;
            this.setState({
                typeShow:true
            });
        }
    }
    onTypeChange = (value) =>{
        if(value ==='script' || value ==='react'){
            this.setState({typeShow:true});
        }else{
            this.setState({typeShow:false});
        }
    };
    render() {
        let temp = '';
        let imgUrl = '';
        let imgData = {};
        const me = this;
        const {data} = me.state;
        const Option = Select.Option;
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 8}
            }
        };
        let {imageId, imageName = ''} = data.updComponentImage || {};
        if(imageId) {
            imgData = {id:imageId};
            imgUrl = IMG_URL + '/' + imageId;
        }
        let props = {
            name: 'file',
            action: IMG_URL,
            data: imgData,
            headers: {
                authorization: 'authorization-text'
            },

            showUploadList: false,
            onChange(info) {
                if (info.file.status === 'done') {
                    if (info.file &&
                        info.file.response &&
                        info.file.response.data &&
                        info.file.response.data[0]
                    ) {
                        let {name, response} = info.file;
                        let updComponentImage = {
                            imageName: name,
                            imageId:  response.data[0]
                        };
                        me.setState({
                            data: Object.assign({}, data, {updComponentImage})
                        });
                    }
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        };
        if(this.state.typeShow){
            temp = <FormItem label="导出变量名" {...formItemLayout}
                extra="该组件导出方式不是export或者define的，需要使用全局导出变量名，如jQuery的全局变量'$' 。">
                {getFieldDecorator('exportName', {
                    initialValue: data.exportName
                })(
                    <Input />
                )}
            </FormItem>;
        }else{
            temp = '';
        }
        return (
            <div className="amp-widget">
                <div className="amp-widget-title">系统管理<span>·</span>组件管理<span>·</span>基本信息</div>
                <div className="amp-widget-detail">
                    <Form onSubmit={this.onSubmit}>
                        <FormItem label="组件名" {...formItemLayout} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    message: '请输入组件名',
                                    whitespace: true
                                }],
                                initialValue: data.name
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="组件URL" {...formItemLayout} >
                            {getFieldDecorator('url', {
                                rules: [{
                                    required: true, message: '请输入组件URL',
                                    whitespace: true
                                }],
                                initialValue: data.url
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="组件描述" {...formItemLayout} >
                            {getFieldDecorator('description', {
                                rules: [{
                                    required: true, message: '请输入组件描述',
                                    whitespace: true
                                }],
                                initialValue: data.description
                            })(
                                <Input type="textarea" rows={4} autosize={{minRows: 4, maxRows: 4}}/>
                            )}
                        </FormItem>
                        <FormItem label="加载类型" {...formItemLayout} >
                            {getFieldDecorator('loadType', {
                                initialValue: data.loadType ? data.loadType : 'script',
                                onChange:this.onTypeChange
                            })(
                                <Select>
                                    <Option value="script">JavaScript</Option>
                                    <Option value="react">React</Option>
                                    <Option value="ajax">Ajax</Option>
                                    <Option value="iframe">Iframe</Option>
                                </Select>
                            )}
                        </FormItem>
                        {temp}
                        <FormItem label="组件中文名" {...formItemLayout}>
                            {getFieldDecorator('zhCN', {
                                initialValue: data.zhCN
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="组件英文名" {...formItemLayout}>
                            {getFieldDecorator('enUS', {
                                rules: [{
                                    pattern: /^[A-Za-z]+$/,
                                    message: '请输入正确的英文名'
                                }],
                                initialValue: data.enUS
                            })(
                                <Input type="text"/>
                            )}
                        </FormItem>
                        <FormItem label="组件图标" {...formItemLayout}>
                            {getFieldDecorator('icon', {
                                initialValue: data.icon
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="组件高度" {...formItemLayout}>
                            {getFieldDecorator('height', {
                                initialValue: data.height
                            })(
                                <InputNumber />
                            )}
                        </FormItem>
                        <FormItem label="组件宽度" {...formItemLayout}>
                            {getFieldDecorator('width', {
                                initialValue: data.width
                            })(
                                <InputNumber />
                            )}

                        </FormItem>
                        <FormItem label="组件排序" {...formItemLayout}>
                            {getFieldDecorator('sortNumber', {
                                initialValue: data.sortNumber ? data.sortNumber : 1
                            })(
                                <InputNumber min={1}/>
                            )}

                        </FormItem>
                        <FormItem label="是否启用" {...formItemLayout} >
                            {getFieldDecorator('isUse', {
                                initialValue: String((data.isUse !== undefined) ? data.isUse : true)
                            })(
                                <Select>
                                    <Option value="true">启用</Option>
                                    <Option value="false">禁用</Option>
                                </Select>
                            )}
                        </FormItem>
                        {/*图片上传*/}
                        <FormItem label="组件缩略图" {...formItemLayout} >
                            {getFieldDecorator('updComponentImage', {
                                initialValue: data.updComponentImage || {}
                            })(
                                <Upload {...props}>
                                    <img
                                        alt={imageName || ''}
                                        src={imgUrl || ''}
                                        style={{ width: '30px', marginRight: '10px'}}
                                        onClick={_=>window.open(imgUrl, '_blank')}
                                    />
                                    <Button>
                                        <Icon type="upload" /> 上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{
                                xs: {span: 24, offset: 0},
                                sm: {span: 6, offset: 13}
                            }}
                        >
                            <Button onClick={this.onCancelClick} size="large">取消</Button>
                            <Button disabled={this.state.disabled} type="primary" htmlType="submit"
                                size="large">保存</Button>
                        </FormItem>
                    </Form>
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

export const WidgetDetail = Form.create()(_WidgetDetail);
