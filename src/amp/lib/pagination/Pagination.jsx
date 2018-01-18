import React from 'react';
import {Pagination as _Pagination} from 'antd';
/*
 *select
 * */
export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:props.currentPage
        };
    }

    componentWillReceiveProps(nextProps){
        this.state = {
            currentPage:nextProps.currentPage
        };
    }
    onPageChange = (page) => {
        const {onChange, currentPage} = this.props;
        if (page != currentPage) {
            onChange(page - 1);
        }
    };

    render() {
        const {totalPages, total, pageSize, showQuickJumper} = this.props;

        if (total > 0) {
            if (totalPages > 1) {
                return (
                    <div className="amp-page">
                        <div className="amp-page-total">
                            共<span>{totalPages}</span>页
                            <span></span>总计<span>{total}</span>条
                        </div>
                        <_Pagination pageSize={pageSize}
                            current={this.state.currentPage}
                            total={total}
                            showQuickJumper={showQuickJumper}
                            onChange={this.onPageChange}/>
                        <div className="clear"></div>
                    </div>
                );
            } else {
                return (
                    <div className="amp-page">
                        <div className="amp-page-total">
                            共<span>{totalPages}</span>页
                            <span></span>总计<span>{total}</span>条
                        </div>
                        <div className="clear"></div>
                    </div>
                );
            }
        } else {
            return <div></div>;
        }
    }
}
