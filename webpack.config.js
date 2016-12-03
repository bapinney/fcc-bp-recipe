var Webpack = require('webpack');
//var LiveReloadPlugin = require('webpack-livereload-plugin');
var path = require('path'); //Part of Node.JS -- not a separate package.
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: [
        'babel-polyfill',
        './main.js',
        'webpack-dev-server/client?http://localhost:8080'
    ],


    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'wp-bundle.js'
    },

    devServer: {
        inline: true,
        port: 8080
    },

    devtool: 'source-map', // See https://webpack.github.io/docs/configuration.html -- This is for JavaScript files

    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',                
                query: {
                    plugins: ['transform-runtime'],
                    presets: 
                    [
                        'es2015',
                        'react'
                    ]
                }
            }
      ]
    },
    
    target: "web",

    plugins: [
//        "transform-es2015-modules-commonjs",
/*      new LiveReloadPlugin({
            appendScriptTag: true
        }),*/
        //new ExtractTextPlugin("[name]-compiled.css"),
        
        new Webpack.ProvidePlugin({
            "React": "react"
        })
   ]
}

module.exports = config;