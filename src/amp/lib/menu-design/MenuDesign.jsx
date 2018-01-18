import React, {Component} from 'react';
import update from 'react/lib/update';
import {Button, Tree, Input, Modal, message} from 'antd';
import {axiosConfig} from '../utils/axiosConfig';
import {generateTree} from '../utils';
const TreeNode = Tree.TreeNode;
class MenuDesign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialTreeData: [],
            treeData: [],
            expandedKeys: [],
            checkedKeys: [],
            edibleKey: '',
            visible: false
        };
    }

    componentDidMount() {
        axiosConfig.get('ud/menu')
            .then( (result)=> {
                let treeData = generateTree(result.data.data);
                this.setInitialTree(treeData);
            });
    }

    onExpand = (expandedKeys) => {
        this.setState({expandedKeys});
    };

    onSelect = (selectedKeys) => {
        let expandedKeys = this.state.expandedKeys;
        let key = selectedKeys[0];
        let index = expandedKeys.indexOf(key);
        if (index === -1) {
            expandedKeys.push(key);
        } else {
            expandedKeys.splice(index, 1);
        }
        this.setState({
            expandedKeys: expandedKeys
        });
    };

    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        // const dragNodesKeys = info.dragNodesKeys;
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = this.state.treeData;
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        let dropParentId;
        if (info.dropToGap) {
            let ar;
            let i;
            let dropKeySort;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
                dropParentId = item.parentId;
                dropKeySort = item.menuSort;
                item.menuSort = dragObj.menuSort + 1;
            });
            dragObj.parentId = dropParentId;
            ar.splice(i, 0, dragObj);
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
                dropParentId = item.key;
                item.children.forEach((child) => {
                    if (dragObj.menuSort < child.menuSort) {
                        dragObj.menuSort = child.menuSort + 1;
                    }
                });
            });
            dragObj.parentId = dropParentId;
        }
        this.setState({
            treeData: data
        });
        //菜单动态渲染
        // const {getTreeData} = this.props.params;
        // getTreeData(data);
    };

    onCheck = (checkedKeys, info) => {
        this.setState({checkedKeys: checkedKeys});
        let delFlag = info.checked ? 0 : 1;
        const loop = (data, key, flag) => {
            data.forEach((item) => {
                if (item.key === key || flag === true) {
                    item.delFlag = delFlag;
                    if (item.children && item.children.length) {
                        loop(item.children, key, true);
                    }
                }
                if (item.children && item.children.length) {
                    loop(item.children, key);
                }
            });
        };
        let data = update(this.state.treeData,{$merge:{}});
        loop(data, info.node.props.eventKey);
        this.setState({
            treeData: data
        });
        //菜单动态渲染
        // const {getTreeData} = this.props.params;
        // getTreeData(data);
    };

    onMenuApply = () => {
        let menus = [];
        const loop = (data) => {
            data.forEach((item) => {
                if (item.children && item.children.length) {
                    loop(item.children);
                    let menuItem = Object.assign({}, item);
                    delete menuItem['children'];
                    menus.push(menuItem);
                } else {
                    menus.push(item);
                }
            });
        };
        loop(this.state.treeData);
        axiosConfig.post('/ud/menu', menus)
            .then((result) => {
                if (result.data.success === true) {
                    message.success('菜单保存成功');
                }
            });
    };

    onDoubleClick=(event, key)=>{
        this.setState({
            edibleKey: key
        });
    };

    onEditOk = (event, editKey) => {
        let newTitle = event.target.value;
        let data = this.state.treeData;
        const loop = (data, key, callback) => {
            data.forEach((item) => {
                if (item.key === key) {
                    return callback(item);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        loop(data, editKey, (item) => {
            item.menuName = newTitle;
        });
        this.setState({
            treeData: data,
            edibleKey: ''
        });
        //菜单动态渲染
        // const {getTreeData} = this.props.params;
        // getTreeData(data);
    };

    onEditEnter = (event, key) => {
        if (event.keyCode === 13) {
            this.onEditOk(event, key);
        }
    };

    //深拷贝
    cloneObj = (obj) => {
        let str, newObj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return null;
        } else if(window.JSON){
            str = JSON.stringify(obj);
            newObj = JSON.parse(str);
        } else {
            for(let i = 0; i++; i < obj.length){
                newObj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i];
            }
        }
        return newObj;
    };

    setInitialTree = (data) => {
        let checkedKeys = [];
        const loop = (data) => {
            data.forEach((item) => {
                if (item.delFlag === 0 && !item.children) {
                    checkedKeys.push(item.key);
                }
                if (item.children && item.children.length) {
                    loop(item.children);
                }
            });
        };
        loop(data);
        this.setState({
            initialTreeData: this.cloneObj(data),
            treeData: data,
            checkedKeys: checkedKeys,
            visible: false
        });
    };

    handleOk = () => {
        this.setState({visible: true});
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const loop = (data) => data.map((item) => {
            let title = <span onDoubleClick={(event) => this.onDoubleClick(event, item.key)}>{item.menuName}</span>;
            if (item.key === this.state.edibleKey) {
                title = <Input defaultValue={item.menuName} autoFocus
                    onBlur={(event) => this.onEditOk(event, item.key)}
                    onKeyUp={(event) => this.onEditEnter(event, item.key)}/>;
            }
            if (item.children && item.children.length) {
                return <TreeNode key={item.key} title={title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={title}/>;
        });
        return (
            <div className="amp-widget">
                <div className="amp-widget-title">菜单定制</div>
                <div className="amp-menu-content">
                    <div className="amp-menu-bottom">
                        <Modal className="confirm" title='提示' visible={this.state.visible}
                            onOk={() => this.setInitialTree(this.state.initialTreeData)}
                            onCancel={this.handleCancel}
                            okText='确定' cancelText='取消'
                        >
                            <p>确定要将菜单重置为初始状态？</p>
                        </Modal>
                        <Button icon="reload" onClick={this.handleOk}>重置</Button>
                        <Button type="primary" icon="save" onClick={this.onMenuApply}>应用</Button>
                    </div>

                    <Tree
                        className="amp-menu-body"
                        checkable={true}
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        defaultExpandedKeys={this.state.expandedKeys}
                        draggable
                        onDragEnter={this.onDragEnter}
                        onDrop={this.onDrop}
                        onSelect={this.onSelect}
                    >
                        {loop(this.state.treeData)}
                    </Tree>


                </div>
            </div>
        );
    }
}

export {MenuDesign};
