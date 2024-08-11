import * as path from 'path';
import * as webpack from 'webpack';

import 'webpack-dev-server';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
const config: webpack.Configuration = {
	// mode: 'production',
	mode: 'development',
	// entry: './src/index.ts',

	entry: {
		index: './src/node/index.ts',
		'index.min': './src/node/index.ts',
	},
	output: {
		path: path.resolve(__dirname, '../../dist/umd/node'),
		filename: '[name].js',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.d.ts'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	devtool: 'source-map',
	plugins: [
		new ParallelUglifyPlugin({
			minimize: true,
			sourceMap: true,
			include: /\.min\.js$/,
		}),
	],
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
				loader: 'awesome-typescript-loader',
				options: {
					transpileOnly: true,
					configFileName: './tsconfig.umd.json', // 在此处指定您的 tsconfig 文件路径
				},
			},
		],
	},
};

export default config;
