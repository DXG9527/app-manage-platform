import React, {Component} from 'react';
import {Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
class  AuthManageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedOptions: this.props.checkedOptions,
            authOptionsVisible: this.props.checked ?  'auth-options-visible' : 'auth-manage-invisible',
            checked: this.props.checked,
            visible: this.props.visible ? '' : 'auth-manage-invisible'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkedOptions) {
            this.setState({
                checkedOptions: nextProps.checkedOptions,
                checked: nextProps.checked,
                authOptionsVisible: nextProps.checked ?  'auth-options-visible' : 'auth-manage-invisible'
            });
        }
    }

    userOptionsChange = (event) => {
        this.setState({
            authOptionsVisible:event.target.checked ?  'auth-options-visible' : 'auth-manage-invisible',
            checkedOptions: event.target.checked ? ['r', 'w'] : [],
            checked: event.target.checked
        });
        this.props.userOptionsChange(event);
    };

    authOptionsChange = (checkedOptions) => {
        if (checkedOptions.indexOf('w') !== -1) {
            checkedOptions.indexOf('r') === -1 ? checkedOptions.push('r') : checkedOptions;
        }
        this.setState({
            checkedOptions
        });
        this.props.authOptionsChange(checkedOptions);
    };

    render() {
        let user = this.props.user;
        let authOptions  = [
            {label:'可读', value:'r', disabled: false},
            {label:'可写', value:'w', disabled: false},
            {label:'执行', value:'x'}
        ];
        return (
            <div className={`${this.props.visible} auth-manage-list`}>
                <Checkbox
                    className="auth-manage-layout auth-user-list"
                    value={user}
                    checked={this.state.checked}
                    onChange={this.userOptionsChange}>
                    {user.userName}
                </Checkbox>
                <div className={`${this.state.authOptionsVisible}`}>
                    <CheckboxGroup
                        options={authOptions}
                        disabled
                        value={this.state.checkedOptions}
                        onChange={this.authOptionsChange}/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}

export default AuthManageList;
