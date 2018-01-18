'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

module.exports = {
    devtool: 'hidden-source-map',
    //输出配置
    output: {
        path: path.join(__dirname, './../dist/'),
        filename: '[name].js',
        publicPath: defaultSettings.publicPath
    },
    devServer: {
        contentBase: './src/',
        historyApiFallback: true,
        hot: true,
        port: defaultSettings.port,
        noInfo: false,
        disableHostCheck: true
    },
    resolve: {
        //import文件的查找方式，如果不存在文件后缀，依次尝试 js jsx 后缀
        extensions: ['.js', '.jsx'],
        modules: [defaultSettings.srcPath, 'node_modules']
    },
    module: {}
};
