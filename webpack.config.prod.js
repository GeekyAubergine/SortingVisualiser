var webpack = require('webpack');
var assign = require('lodash/assign');
var base = require('./webpack.config.js');

module.exports = assign({}, base, {
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: true,
			compress: {
				drop_console: true,
			}
		}),
	]
});
