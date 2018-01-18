import React from 'react';
import {Button, Col, Form, Input, message, Modal, Row, Select} from 'antd';
import {axiosConfig} from '../utils/axiosConfig';
import {hashHistory} from 'react-router';

class _ParamDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            visible: false,
            data: {},
            id: '',
            page:0
        };
        if (this.props.location && this.props.location.state && this.props.location.state.page) {
            this.state.page = this.props.location.state.page;
        }
    }

    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            axiosConfig.get(`/upd/platformparams/${this.props.location.state.id}`)
                .then((result) => {
                    if (result.data.data) {
                        this.setState({data: result.data.data[0], id: this.props.location.state.id});
                    }
                });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({disabled: true});
                let page = this.state.page;
                if (this.state.id) {
                    values.id = this.state.id;
                }else{
                    page = 0;
                }
                axiosConfig.post('/upd/platformparams', values)
                    .then((result) => {
                        this.setState({visible: true});
                        setTimeout(() => {
                            this.setState({disabled: false, visible: false});
                            hashHistory.push({
                                pathname: '/param',
                                state:{page:page}
                            });
                        }, 2000);
                    })
                    .catch((error) => {
                        this.setState({disabled: false});
                    });
            }
        });
    }
    onCancelClick = (event) => {
        hashHistory.push({
            pathname: '/param',
            state:{page:this.state.page}
        });
    }
    onUniqueCheckClick = (event) => {
        const value = this.props.form.getFieldValue('paramKey');
        if (value) {
            let param = {
                paramKey: value
            };
            if (this.state.id) {
                param.id = this.state.id;
            }
            axiosConfig.get('/upd/platformparams/unique', {
                params: param
            })
                .then((result) => {
                    console.log(result);
                    if (result.data.success) {
                        message.destroy();
                        message.success('检测成功，可以使用');
                    }
                });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
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
        return (
            <div className="amp-widget">
                <div className="amp-widget-title">系统管理<span>·</span>参数管理<span>·</span>基本信息</div>
                <div className="amp-widget-detail">
                    <Form onSubmit={this.onSubmit}>
                        <FormItem label="参数名称" {...formItemLayout} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入参数名称',
                                    whitespace: true
                                }],
                                initialValue: this.state.data.name
                            })(
                                <Input type="text"/>
                            )}
                        </FormItem>
                        <FormItem label="参数key值" {...formItemLayout} >
                            <Row gutter={10}>
                                <Col span={15}>
                                    {getFieldDecorator('paramKey', {
                                        rules: [{
                                            required: true,
                                            message: '请输入参数key值',
                                            whitespace: true
                                        }, {
                                            pattern: /^\w+$/,
                                            message: '参数key值由数字、字母和下划线组成'
                                        }],
                                        initialValue: this.state.data.paramKey
                                    })(
                                        <Input type="text"/>
                                    )}
                                </Col>
                                <Col span={4}>
                                    <Button onClick={this.onUniqueCheckClick}>验证唯一性</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="参数类型" {...formItemLayout} >
                            {getFieldDecorator('dataType', {
                                initialValue: this.state.data.dataType ? this.state.data.dataType : 'String'
                            })(
                                <Select>
                                    <Option value="String">String</Option>
                                    <Option value="Number">Number</Option>
                                    <Option value="Boolean">Boolean</Option>
                                    <Option value="Date">Date</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="参数格式" {...formItemLayout} >
                            {getFieldDecorator('format', {
                                initialValue: this.state.data.format
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            wrapperCol={{
                                xs: {span: 24, offset: 0},
                                sm: {span: 4, offset: 13}
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

export const ParamDetail = Form.create()(_ParamDetail);
