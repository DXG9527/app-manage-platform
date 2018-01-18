import {message} from 'antd';
/**
 * 取得字符串前30个字符
 * @param str
 * @returns {string}
 */
export function getLimitWord(str) {
    if (!str) {
        return '';
    }
    let len = 0, value = '';
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
        if (len <= 30) {
            value += str[i];
        } else {
            if (i < str.length) {
                value += '...';
            }
            break;
        }
    }
    return value;
}

export function format(dateString, fmt) {
    let date = new Date(dateString.replace(/-/g, '/'));
    var o = {
        'M+': date.getMonth() + 1,                 //月份
        'd+': date.getDate(),                    //日
        'h+': date.getHours(),                   //小时
        'm+': date.getMinutes(),                 //分
        's+': date.getSeconds(),                 //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

export function generateTree(data) {
    data.sort(function (a, b) {
        return a['menuSort'] - b['menuSort'];
    });
    let treeData = [];
    data.forEach((item) => {
        item.key = item.menuId;
        if (item.parentId === '-1') {
            let children = [];
            data.forEach((childItem) => {
                if (childItem.parentId === item.menuId) {
                    children.push(childItem);
                    item.children = children;
                }
            });
            treeData.push(item);
        }
    });
    return treeData;
}
