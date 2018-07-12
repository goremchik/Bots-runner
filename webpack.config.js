const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dist = path.join(__dirname, 'dist/');
const app = path.join(__dirname, 'src/');

const env = process.argv[process.argv.length - 1];
const isProduction = env === 'production';

module.exports = {
  context: __dirname,
  entry: {
    index: app + '/js/index',
  },
  output: {
    path: dist ,
    filename: '[name].js'
  },

  
 module: {
 	rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        },  'eslint-loader']

    }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader",
                options: {
                    minimize: isProduction
                }
            }, "postcss-loader", "less-loader"]
        })
    }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        minimize: isProduction
                    }
                }, 'postcss-loader']
            })
    }, {
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

      new CopyWebpackPlugin([{
          from: '*/*.html',
          to: dist,
          flatten: true
      },{
          from: app + 'styles/reset.min.css',
          to: dist,
          flatten: true
      }]),
      new ExtractTextPlugin('[name].css')

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