const path            = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry  : {
        inject     : './src/inject.ts'
    },
    output : {
        filename: '[name].js',
        path    : path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts"]
    },
    module : {
        loaders: [
            {loader: "ts-loader"}
        ]
    },

    plugins: [
        //plugin doc: https://www.npmjs.com/package/copy-webpack-plugin
        new CopyWebpackPlugin([{from: 'static'}])
    ]
};