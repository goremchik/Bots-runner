var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

const extractCSS = new ExtractTextPlugin(APP_DIR + '/styles/[name].css');
const extractLESS = new ExtractTextPlugin(APP_DIR + './styles/[name].less');

module.exports = {
  entry: {
    index: APP_DIR + '/js/index',
    style: APP_DIR + "/styles/style.less"
  },
  output: {
    path: BUILD_DIR ,
    filename: 'build.js'
  },

  
 module: {
 	rules: [
        {
            test: /\.css$/,
            use: extractCSS.extract(["css-loader"]),
        },
        {
            test: /\.less$/,
            use: extractLESS.extract(["css-loader", "less-loader"]),
        }/*,
        {
            test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            use: "file?name=[path][name].[ext]",
        }*/
    ],
	  loaders : [{
        test : /\.js$/,
        exclude: /node_modules/,
        loader : 'babel-loader',
        query: {
          presets: ['es2015', 'es2016', 'es2017']
      }
      }]
  },

  plugins: [ 
      extractLESS, 
      extractCSS, 
      new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          minChunks: 2
      })
  ],
  watch: true,
  watchOptions: {
      aggregateTimeout: 100
  },

  devtool: "cheap-inline-module-source-map"
 /* devServer: {
    inline:true,
	contentBase: BUILD_DIR
    port: 8000
  },
  */
  
};