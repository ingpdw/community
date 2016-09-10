var webpack = require( 'webpack' );
//require( 'babel-polyfill' );


module.exports = {
  context: __dirname + '/_src',
  entry: ['./js/app.js'],
  //entry: ['babel-polyfill', './js/app.js'],
  output: {
    filename: 'index.js',
    path: __dirname + '/js',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.BannerPlugin('project: NCSOFT community js\nauthor: pdw@ncsoft.com'),
    new webpack.optimize.UglifyJsPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
