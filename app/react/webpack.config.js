var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: [
        './index.jsx',
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'webpack/hot/only-dev-server'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: "/assets/"
    },
    module: {
        loaders: [{
                test: /\.jsx$/,
                loaders: ['react-hot','babel'],
                exclude: /node_modules/,
                include: __dirname
            },
        {
            test: /\.css?$/,
            loaders: ['style', 'css'],
            include: __dirname
        }]
	},
    devtool:'eval-source-map'
}

//'webpack-dev-server/client?http://0.0.0.0:8080',
