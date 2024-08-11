import * as path from 'path';
import * as webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const config: webpack.Configuration = {
	// mode: 'production',
	mode: 'development',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist/base'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.d.ts'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},

	module: {
		rules: [
			// {
			// 	test: /\.tsx?$/,
			// 	exclude: /node_modules/,
			// 	loader: 'ts-loader',
			// },
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
		],
	},
};

export default config;
