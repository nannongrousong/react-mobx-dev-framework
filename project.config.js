module.exports = {
    port: 9000,
    entries: [{
        name: 'admin',
        entry: 'src/admin/index.js',
        title: '开放平台 - 开发',
        template: 'src/admin/index.html',
        favicon: 'src/admin/favicon.ico'
    }],
    proxy: [{
        //  拦截的路由匹配
        router: '/api',
        //  目标服务器
        target: 'http://',
        //  路由重写规则
        //  pathRewrite: { '^/admin/api': '/' }
    }],
    deployServer: {
        enable: false,
        host: '',
        username: '',
        password: '',
        path: ''
    }
}