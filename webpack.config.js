const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dist = path.join(__dirname, 'dist');
const app = path.join(__dirname, 'src/');

const extractCSS = new ExtractTextPlugin(app + '/styles/[name].css');
const extractLESS = new ExtractTextPlugin(app + './styles/[name].less');

const env = process.argv[process.argv.length - 1];
const isProduction = env === 'production';

module.exports = {
  context: __dirname,
  entry: {
    index: app + '/js/index',
    style: app + "/styles/style.less"
  },
  output: {
    path: dist ,
    filename: 'app.js'
  },

  
 module: {
 	rules: [
        {
            test: /\.css$/,
            use: extractCSS.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        minimize: isProduction
                    }
                }, 'postcss-loader']
            })
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', 'es2015', 'es2016', 'es2017']
                }
            },  'eslint-loader']

        },
        {
            test: /\.less$/,
            use: extractLESS.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        minimize: isProduction
                    }
                }, "postcss-loader", "less-loader"]
            })
        }
        , {
            test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024
                }
            }]
        }

        // {
        //     test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        //     use: "file?name=[path][name].[ext]"
        // }
    ]
  },

  plugins: [
      new CleanWebpackPlugin(dist),
      extractLESS, 
      extractCSS
  ],
  watch: !isProduction,
  watchOptions: {
      aggregateTimeout: 100
  },

    devtool: !isProduction ? "source-map" : false,

    devServer: {
        contentBase: dist,
        port: 8000,
        compress: true
    },

    optimization: {
        minimize: isProduction,
        splitChunks: {
            cacheGroups: {
                commons: {
                    //test:/[\\/]node_modules[\\/]/,
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                }
            }
        }
    }

};