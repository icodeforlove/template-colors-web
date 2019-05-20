
module.exports = [
	{
		mode: 'production',

		target: 'web',

		entry: `${__dirname}/src/index`,

		output: {
			path: `${__dirname}/dist-browser`,
			filename: 'template-colors.js',
			library: 'c'
		},

		module: {
			rules: [
				{
					test: /\.js$/,
				    use: {
						loader: 'babel-loader',
						options: {}
					}
				}
			]
		},

		devtool: 'source-map'
	}
];