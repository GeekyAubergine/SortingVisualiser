var webpack = require('webpack');
var path = require('path');

module.exports =  {
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'Src']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ["react", "stage-0", "es2015",],
          plugins: [
            "syntax-async-functions",
            "transform-async-to-generator",
            "transform-regenerator",
            "transform-runtime",
            "transform-class-properties"
          ]
        }
      }
    ]
  },
  bail: false
}
