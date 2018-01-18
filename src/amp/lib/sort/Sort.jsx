import React from 'react';
/**
 * Created by Administrator on 2017/4/20.
 */
export default class Sort extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick = (event) => {
        let {onChange, value, sortKey} = this.props;
        if (value === 'ASC') {
            value = 'DESC';
        } else if (value === 'DESC') {
            value = '';
            sortKey = '';
        } else {
            value = 'ASC';
        }
        onChange(sortKey, value);
    };

    render() {
        const {className, value, title} = this.props;
        let clsTop = '';
        let clsBtm = '';
        if (value === 'ASC') {
            clsTop = 'high-light';
            clsBtm = '';
        } else if (value === 'DESC') {
            clsTop = '';
            clsBtm = 'high-light';
        } else if (value === '') {
            clsTop = '';
            clsBtm = '';
        }
        return (
            <div className={className} onClick={this.onClick}>
                <span>{title}</span>
                <div>
                    <i className={`fa fa-caret-up ${clsTop}`}></i>
                    <i className={`fa fa-caret-down ${clsBtm}`}></i>
                </div>
            </div>
        );
    }
}
