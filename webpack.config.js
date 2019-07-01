const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
//  antd样式覆盖
const antdCover = require(path.resolve(__dirname, './src/admin/config/antdCover.js'));
const webpack = require('webpack');
const fs = require('fs');
const projectConfig = require('./project.config');
const { NODE_ENV } = process.env;
const { entries } = projectConfig;
const pathSep = path.sep;
const isDev = NODE_ENV === 'development';

//  webpack alias
const rootPath = path.resolve(__dirname, 'src');
const recurReadDir = (rootPath) => {
    let dirs = [];
    let presentPathFiles = fs.readdirSync(rootPath);
    for (let fileName of presentPathFiles) {
        let filePath = path.resolve(rootPath, fileName);
        if (fs.statSync(filePath).isDirectory()) {
            dirs.push(filePath);
            dirs = dirs.concat(recurReadDir(filePath));
        }
    }
    return dirs;
}

let jsconfigPaths = {};
let allDirs = recurReadDir(rootPath);
let webpackAlias = allDirs.reduce((previous, current) => {
    let key = current.substring(rootPath.length + 1).split(pathSep).join('_').toUpperCase();
    previous[key] = current;
    jsconfigPaths[key + '/*'] = [current + pathSep + '*'];
    return previous;
}, {});

//  write webpack alias into jsconfig.json for vscode intellisense
let jsconfigContent = {
    "compilerOptions": {
        "experimentalDecorators": true,
        "module": "commonjs",
        "baseUrl": ".",
        "paths": jsconfigPaths
    }
};
fs.writeFileSync(path.resolve(__dirname, 'jsconfig.json'), JSON.stringify(jsconfigContent));

let webpackEntry = entries.reduce((previous, current) => {
    if (isDev) {
        previous[current.name] = ['webpack-hot-middleware/client?quiet=true&reload=true', path.resolve(__dirname, current.entry)];
    } else {
        previous[current.name] = [path.resolve(__dirname, current.entry)];
    }
    return previous;
}, {});

let webpackConfig = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : '',
    entry: webpackEntry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `[name].[${isDev ? 'hash' : 'chunkhash'}:8].js`,
        chunkFilename: `[name].[${isDev ? 'hash' : 'chunkhash'}:8].chunk.js`,
        // or cdn  https://cdn.your.com/static
        publicPath: isDev ? '/' : './'
    },
    resolve: {
        extensions: ['.js', '.css', '.json'],
        alias: {
            ...webpackAlias,
            '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/admin/config/icon.js')
        }
    },
    optimization: {

    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre'
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                loader: 'happypack/loader?id=happyBabel'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: `[name]_[local]_[hash:6]`
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                            localIdentName: `[name]_[local]_[hash:6]`
                        }
                    },
                    'less-loader?javascriptEnabled=true',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true,
                            modifyVars: antdCover
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|xlsx?|png|jpe?g|gif|svg|bmp)$/,
                loader: 'file-loader'
            },
        ]
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: `[name].[${isDev ? 'hash' : 'chunkhash'}:8].css`,
            chunkFilename: `[name].[${isDev ? 'hash' : 'chunkhash'}:8].chunk.css`,
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        ...entries.map((item) => {
            return new HtmlWebpackPlugin({
                template: path.resolve(__dirname, item.template),
                inject: true,
                title: item.title,
                filename: `${item.name}.html`,
                chunks: [item.name, 'vendors', 'manifest'],
                chunksSortMode: 'none',
                favicon: path.resolve(__dirname, item.favicon)
            });
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: isDev,
                }
            }],
            threadPool: happyThreadPool,
            verbose: true
        })
    ]
}

if (isDev) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    webpackConfig.plugins.push(
        new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new CleanWebpackPlugin(['dist/*'], {
            verbose: true,
            dry: false
        })
    );

    webpackConfig.optimization = {
        minimize: true,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    };
}

module.exports = webpackConfig;