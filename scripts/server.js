const startTime = + new Date();
// resolve arguments
let argvs = process.argv.splice(2);
let argObj = argvs.reduce((prev, curr) => {
    let [k, v] = curr.split('=');
    prev[k] = v;
    return prev;
}, {});

const webpack = require('webpack');
const projectConfig = require('../project.config');
const { port } = projectConfig;
const { mode, env } = argObj;
process.env.NODE_ENV = env;
const webpackConfig = require('../webpack.config');
const path = require('path');

if (env === 'development') {
    const express = require('express');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const history = require('connect-history-api-fallback');
    const app = express();
    const compiler = webpack(webpackConfig);
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const open = require('opn');

    // use:https://www.npmjs.com/package/connect-history-api-fallback#introduction
    app.use(history({
        //  whether show log 
        verbose: false,
        rewrites: [{
            //  filter http GET where url startwith 'api'
            from: /^\/api\//,
            to: (context) => (context.parsedUrl.pathname)
        }, ...projectConfig.entries.map((item) => {
            return {
                from: new RegExp(`^\/${item.name}\/`),
                to: `/${item.name}.html`
            }
        })]
    }));

    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/',
        stats: 'errors-only'
        //  stats: 'verbose' // all info
    }));

    app.use(webpackHotMiddleware(compiler));

    if (mode == 'proxy') {
        // proxy
        const httpProxyMiddleware = require('http-proxy-middleware');
        projectConfig.proxy.forEach((prox) => {
            app.use(prox.router, httpProxyMiddleware({
                target: prox.target,
                changeOrigin: true,
                pathRewrite: prox.pathRewrite
            }))
        });
    } else {
        //  mock
        const apiMocker = require('webpack-api-mocker');
        apiMocker(app, path.resolve(__dirname, 'mock/index.js'));
    }

    app.listen(port, () => {
        console.log(`server is running at http://localhost:${port}/admin!\n`);
        open(`http://localhost:${port}/admin`);
    });
} else {
    //  build directly
    webpack(webpackConfig, async (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('webpack error!', err ? err : stats);
            return;
        }

        console.log(stats.toString({ chunks: false, maxModules: Infinity, color: true }));
        
        console.log(`webpack success!costs: ${+ new Date() - startTime}ms`);

        if (projectConfig.deployServer.enable) {
            const { host, username, password, path: deployPath } = projectConfig.deployServer;
            const localPath = path.resolve(__dirname, '../dist/');
            const date = new Date();
            const dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

            const nodeSSH = require('node-ssh');
            const ssh = new nodeSSH();
            let resData;

            try {
                console.log('start connect deploy server');
                resData = await ssh.connect({ host, username, password });
                console.log('connect server success');

                console.log('start backup old version at deploy server');
                //  只删除文件不删除目录，不然putDirectory容易出错
                resData = await ssh.exec(`cp -r ${deployPath} ${deployPath}-${dateFormat} && find ${deployPath} -type f | xargs rm -rf`);
                console.log('backup success');

                console.log('start upload latest deploy package');
                let failFiles = [];
                let successFiles = [];
                resData = await ssh.putDirectory(localPath, deployPath, {
                    recursive: true,
                    tick: function (localPath, remotePath, error) {
                        if (error) {
                            failFiles.push(localPath)
                        } else {
                            successFiles.push(localPath)
                        }
                    }
                });

                if (!resData) {
                    console.log('failed transfers', failFiles.join(', '))
                    console.log('successful transfers', successFiles.join(', '))
                }
                console.log('upload success');

                console.log('disconnect deploy server');
                ssh.dispose();
            } catch (err) {
                console.log('deplory error!', err);
            }
        }
    })
}