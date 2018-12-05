const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let TARGET = process.env.npm_lifecycle_event;

const htmlArray = [
  {
    tem: path.resolve(__dirname, 'src/pages/index/index.html'),
    filename: 'index.html',
    chunks: ['index'],
  },
];

let getHtmlConfig = (tmp, name, chunks)=> {
  return {
    template: tmp,
    filename: name,
    chunks: chunks,
    minify: TARGET === "dev" ? false : {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
    }
  }
};


let common = {
  entry: {
    index: path.resolve(__dirname, 'src/pages/index/index.js'),
  },
  resolve: {
    alias: {
      'css': path.resolve(__dirname, 'src/css'),
      'js': path.resolve(__dirname, 'src/js'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'images': path.resolve(__dirname, 'src/images'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/css/fonts/[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: [':src'],
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
  ]
};

if (TARGET === 'dev') {
  module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      compress: true,
      contentBase: path.resolve(__dirname, 'dist'),
      quiet: true,
      overlay: {
        errors: true
      },
      open: true,
      host: '192.168.1.105',
      publicPath: 'http://192.168.1.105:8080'
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: 'file-loader',
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js'
    }
  })
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(gif|jpg|jpeg|png)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/images/[name].[hash],[ext]'
          }
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          jquery: {
            chunks: "all",
            test: /jquery/,
            name: 'jquery',
            enforce: true
          },
          swiper: {
            chunks: "all",
            test: /swiper/,
            name: 'swiper',
            enforce: true
          },
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[hash].css'
      }),
    ],
    output: {
      publicPath: '//www.chinagarp.org.cn/templets/garp/',
      filename: 'static/js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
  })
}

htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element.tem,element.filename,element.chunks)));
});