## react-mobx-dev-framework

### 介绍

React前端开发脚手架
*   antdesign 优秀的界面库
*   支持本地mock数据，与后端并行开发
*   支持代理
*   代码分割，按需加载文件
*   webpack/vscode 支持动态alias
*   支持多标签页内容切换数据缓存

### 环境

nodejs/npm

### 开发技能
*   html/css(less)/js
*   [react](https://react.docschina.org/)/react-router/redux
*   [webpack](https://www.webpackjs.com/)
*   [antd](https://ant-design.gitee.io/docs/react/introduce-cn)
*   [mobx](https://cn.mobx.js.org/)


### 运行
*   cnpm i
*   启动
    *   npm run start-proxy 以代理方式启动，代理配置project.config.js/proxy
    *   npm run start-mock  以本地mock数据启动，mock配置scripts/mock

### 发布
*   npm run build 打包发布
*   由于使用browserHistory，会导致url在不刷新页面情况下发生变化，此时服务端不作配置时刷新页面会404.因为服务端也需要做适应配置，将前端所有请求直接打到index.html
