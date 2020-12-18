/**
 * webpack
 */

const Const = require('./src/const.js')

const webpack = require('webpack')
const path    = require('path')
// *************************************
// webpack plugin
// *************************************
const HtmlWebpackPlugin         = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const TerserPlugin              = require('terser-webpack-plugin')
const MiniCssExtractPlugin      = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin')
// const HtmlMinifierPlugin        = require('html-minifier-webpack-plugin')
const globule = require('globule')

// 環境変数
const NODE_ENV     = process.env.NODE_ENV || 'production'
const IS_DEVSERVER = !!(process.env.IS_DEVSERVER)
const IS_GITHUB    = !!(process.env.IS_GITHUB)
const PORT         = process.env.PORT || '1111'
const SRC          = path.resolve(__dirname, 'src')
const DIST         = path.resolve(__dirname, 'docs')

console.log(`*****************************`)
console.log(`*** NODE_ENV: ${ NODE_ENV }`)
console.log(`*** IS_DEVSERVER: ${ IS_DEVSERVER }`)
if (IS_DEVSERVER) {
  console.log(`*** http://localhost:${ PORT }`)
}
console.log(`*****************************`)

const ejsFilesMatched = globule.find([`**/*.ejs`], { cwd : `${ SRC }/components/pages` })

// const entries = IS_DEVSERVER
//   ? [
//     `webpack-dev-server/client?http://localhost:${ PORT }`,
//     'webpack/hot/only-dev-server',
//   ]
//   : {}

const entries = {}
const htmlWebpackPlugins = []

for(const filename of ejsFilesMatched) {
  const name = filename.replace(/\.ejs/g, ``)

  // if (IS_DEVSERVER) {
  //   entries.push(`${ SRC }/components/pages/${ name }.js`)
  //   entries.push(`${ SRC }/components/pages/${ name }.ejs`)
  // } else {
    entries[ name ] = `${ SRC }/components/pages/${ name }.js`
  // }

  htmlWebpackPlugins.push(
    new HtmlWebpackPlugin({
      template: `${ SRC }/components/pages/${ name }.ejs`,
      inject: 'body',
      filename: `${ name }.html`,
      // chunksSortMode: 'dependency',
      chunks: [ name ],
      templateParameters: {
        // IMAGE_ROOT  : IS_GITHUB ? '/hp/docs/assets/images' : '/assets/images',
        // ASSETS_ROOT : IS_GITHUB ? '/hp/docs/assets' : '/assets',
        // ROOT        : IS_GITHUB ? '/hp/docs' : ''
        IMAGE_ROOT  : IS_GITHUB ? './assets/images' : '/assets/images',
        ASSETS_ROOT : IS_GITHUB ? './assets' : '/assets',
        ROOT        : IS_GITHUB ? '.' : ''
      },
      alwaysWriteToDisk: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      hash: true,
    })
  )
}
console.log(entries);

module.exports = {
  mode: NODE_ENV === 'production' ? NODE_ENV : 'development',

  devtool: NODE_ENV === 'production'
    ? false
    : 'cheap-module-eval-source-map',

  entry: entries,

  output: {
    path: DIST,
    publicPath: IS_DEVSERVER ? '/' : `./`,
    filename: `[name].js?[hash]`
    // filename: IS_DEVSERVER ? 'bundle.js' : '[name].js?[chunkhash]'
  },

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: {
    entrypoints: false,
    children: false
  },

  resolve: {
    alias: {
      'src'       : SRC,
      'lib'       : `${ SRC }/lib`,
      'js'        : `${ SRC }/js`,
      'views'     : `${ SRC }/views`,
      'components': `${ SRC }/components`,
      'sass'      : `${ SRC }/sass`,
    },
    extensions: ['.js'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss|.css$/,
        use: [
          IS_DEVSERVER ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              prependData: '$isGithub: ' + IS_GITHUB + ';'
            }
          }
        ]
      },
      {
        test: /\.ejs$/,
        use: [
          // 'html-loader',
          // 'ejs-html-loader',
          {
            loader: 'ejs-compiled-loader',
            options: {
              htmlmin: true,
              htmlminOptions: {
                removeComments: true
              }
            }
          }
        ],
        // use: [
        //   // 'ejs-compiled-loader',
        //   'html-loader',
        //   'ejs-html-loader'
        // ],
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    new MiniCssExtractPlugin({
      publicPath: IS_DEVSERVER ? '/' : `./`,
      filename: '[name].css?[hash]'
    }),
    ...htmlWebpackPlugins,
    new HtmlWebpackHarddiskPlugin(),
    // new HtmlMinifierPlugin()
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],

  devServer: {
    contentBase: `${ DIST }/`,
    host: 'localhost',
    port: PORT,
    inline: true,
    hot: true,
    // disableHostCheck: true,
    historyApiFallback: true,
    watchContentBase: true,
  },

  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          }
        }
      })
    ]
  },

  performance: {
    hints: false
  },
}
