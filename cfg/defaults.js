/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const marked = require('marked');
const renderer = new marked.Renderer();

const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8400;

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules() {
    return {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: srcPath,
                enforce: 'pre',
                use: 'eslint-loader'//js,jsx 预处理，先通过 eslint 语法校验
            },
            {
                test: /\.md$/,
                use: ['html-loader', 'markdown-loader']
            },
            //css加载
            {
                test: /\.css$/,
                //通过 webpack-replace 替换文本内容，将 font 字体改为本地加载，参数可以使用 JSON.stringify 处理
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?minimize'
                })
            },
            //sass 加载，先通过 sass-loader 转化为 css，然后跟普通的 css 加载一样
            {
                test: /\.(sass|scss)/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                minimize: true,
                                outputStyle: 'expanded'
                            }
                        }
                    ]
                })
            },
            //less 加载，先通过 less-loader 转化为 css，然后跟普通的 css 加载一样
            {
                test: /.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [

                        {
                            loader: 'replace-loader',
                            options: {
                                regex: 'https://at.alicdn.com/t/font[^.]*',
                                flags: 'g',
                                sub: './iconfont/iconfont'
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            //图片加载，如果小于 8192，则使用 base64 数据加载，否则使用普通文件的方式加载
            {
                test: /\.(png|jpg|gif|mp4|ogg|mp3)$/,
                use: [{
                    loader: 'file-loader?limit=8192&name=[path][name].[ext]'
                }]
            }
        ]
    };
}

//自动从 entries 获取需要打包的 js 文件
const files = glob.sync('./src/*.jsx');
let entryKeys = [];
const entries = files.reduce(function (memo, file) {
    const name = path.basename(file, path.extname(file));
    entryKeys.push(name);
    memo[name] = file;
    return memo;
}, {
    lib: [
        'react',
        'react-dom',
        'uuid', 'classnames', 'hotkeys-js',
        'immutable', 'axios',
        'title-notify']
});

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

let indexChunks = ['lib', 'index'];

module.exports = {
    additionalPaths: additionalPaths,
    srcPath: srcPath,
    entry: entries,
    entryKeys: entryKeys,
    publicPath: './',
    port: dfltPort,
    getDefaultModules: getDefaultModules,
    markdownLoader: {
        markedOptions: {
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: true,
            sanitize: true,
            smartLists: true,
            smartypants: true
        }
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            //可以指定多个 entryName，打出多个 common 包
            names: ['lib'],
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([
            {from: 'node_modules/font-awesome', to: 'font-awesome/'},
            {from: 'node_modules/@ud/iconfont', to: 'iconfont/'},
            {from: 'node_modules/@ud/font-awesome/build', to: 'ud-font-awesome/'},
            {from: 'node_modules/@ud/polyfills/lib', to: 'polyfills/'}
        ]),
        new HtmlWebpackPlugin({
            title: '管理平台系统',
            template: 'src/template.ejs',
            ie11Url: 'https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads',
            chromeFrameUrl: 'https://dl.google.com/chrome/install/GoogleChromeframeStandaloneEnterprise.msi',
            // stylesheets: [
            //     'https://cdn.bootcss.com/animate.css/3.5.2/animate.min.css'
            // ],
            // scripts: [
            //     'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'
            // ],
            chunksSortMode: function (chunk1, chunk2) {
                var order1 = indexChunks.indexOf(chunk1.names[0]);
                var order2 = indexChunks.indexOf(chunk2.names[0]);
                return order1 - order2;
            },
            chunks: indexChunks,
            // defaultTheme:'theme-light-black' //默认主题
        })
    ]
};
