
/**
 * postcss設定
 */

module.exports = {
  plugins: [
    // require('postcss-flexbugs-fixes'),
    require('autoprefixer')({
      browsers: ["last 2 versions", "ie >= 11", "Android >= 4"]
    }),
  ]
}
