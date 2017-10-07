
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../.dist')
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            exclude: ['node_modules', 'src/client'],
            loader: 'ts-loader'
        }]
    }
};