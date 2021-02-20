const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main:'./src/index.tsx',
        vendor: ["react", "redux"]
    },
    devtool: 'inline-source-map',
    output: {
        publicPath: '/dfd',
        filename: '[fullhash]-[name].js',
        path: path.resolve(__dirname, 'output'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
        ],

    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns : [
                {from: 'public/static', to: 'static' },
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        })
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        hot: true,
        historyApiFallback: {
            index:"/dfd"
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  reuseExistingChunk: true,
                },
            },
        },
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }
};
