系统应用系统应用管理

使用主要类库包括:

* react
* bootstrap

__注意__

本工程采用 ES6、JSX 编写，IDE 可能默认不支持，可以修改配置启用 ES6、JSX 语法支持。

建议使用 JSX 语法的 JS 文件后缀改为 .jsx，否则 JavaScript 支持需要改为 JSX

IntelliJ IDEA :

    依次 选择 Preferences -> Languages & Frameworks -> JavaScript
    然后将 `ECMAScript 5.1` 修改为 `ECMAScript 6`

## 目录说明
### 工程相关
* package.json

    npm 管理配置

* node_modules

    被 `npm` 管理的第三方类库，通过 `npm install`自动安装

* webpack.config.js

    webpack 主配置，通过命令行参数从 cfg 目录下导入合适的配置

* cfg

    webpack 多配置，分为开发、发布、测试

* server.js

    webpack-dev-server 配置

* karma.conf.js

    测试配置

* README.md

    关于项目的说明文档，`markdown` 语法

### 编码相关

* src 源目录

* test 测试目录

* dist 编译目录

### package.json

### scripts
可执行 npm 脚本

* `npm run start` 使用 dev 模式启动 server
* `npm run build` 编译代码
* `publish:snapshot` 发布到快照仓库
* `publish:release` 发布到正式仓库


### devDependencies
开发依赖

* webpack
  webpack依赖
* react-hot-loader
  react 热加载，在不刷新浏览器的情况下，动态替换修改的 react 组件，能保持浏览器状态，需要依赖 webpack-dev-server
* babel-loader
  es6 支持
* eslint-loader
  js语法检查，需要依赖eslint
* style-loader
  style 加载支持，将 css 编译为 js后动态使用style标签插入到 dom 中
* css-loader
  css加载支持
* less-loader
  less加载支持，需要依赖 less
* sass-loader
  sass加载支持，需要依赖 node-sass
* dist 编译目录

#### dependencies
运行依赖
