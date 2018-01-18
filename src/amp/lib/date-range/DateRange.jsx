import React from 'react';
import {DatePicker} from 'antd';
/*
 *range组件
 * */
export default class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            endValue: null,
            startValue: null
        };
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onStartChange = (date, dateString) => {
        const {onChange} = this.props;
        this.state.startValue = date;
        onChange('startTime', dateString);
    }

    onEndChange = (date, dateString) => {
        const {onChange} = this.props;
        this.state.endValue = date;
        onChange('endTime', dateString);
    }

    render() {
        return (
            <div className="amp-date-range">
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="起始"
                    onChange={this.onStartChange}
                    allowClear
                />
                <span>~</span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="结束"
                    onChange={this.onEndChange}
                    allowClear
                />
            </div>

        );
    }

}
