'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let entry = Object.assign({}, defaultSettings.entry);

//自动添加 webpack-dev-server 配置
defaultSettings.entryKeys.forEach((key) => {
    entry[key] = [
        'webpack-dev-server/client?http://0.0.0.0:' + defaultSettings.port,
        'webpack/hot/only-dev-server',
        entry[key]
    ];
});

let config = Object.assign({}, baseConfig, {
    devtool: 'eval-source-map',
    //使用 webpack-dev-server 时的配置，前2个是标准
    entry: entry,
    cache: true,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // 热替换时返回更新的文件名，而不是id
        new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/),
        new webpack.NoEmitOnErrorsPlugin()
    ].concat(defaultSettings.plugins),
    module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.rules.push({
    //使用 react-hot 的标准配置，babel-loader 通过参数的方式跟在 react-hot 后
    test: /\.(js|jsx)$/,
    use: ['react-hot-loader/webpack', 'babel-loader'],
    include: [].concat(
        defaultSettings.additionalPaths,
        [path.join(__dirname, '/../src')]
    )
});

config.devServer.stats = 'normal';

module.exports = config;
