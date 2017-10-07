
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/client/web/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['./src/client/web/.dist']),
        new HtmlWebpackPlugin({
            title: 'Gittie',
            template: './src/client/web/templates/workspace.ejs',
            filename: 'workspace/index.html'
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: 'workspace/bundle.js',
        path: path.resolve(__dirname, '../.dist')
    }
};
