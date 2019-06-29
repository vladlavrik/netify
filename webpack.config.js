const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

module.exports = (env, {mode} = {}) => ({
	entry: './src/panel.ts',
	output: {
		publicPath: '/',
		filename: 'panel.js',
		path: path.resolve(__dirname, 'build'),
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
			options: {
				onlyCompileBundledFiles: true,
			},
		}, {
			test: /\.css$/,
			use: [{
				loader: 'style-loader',
			}, {
				loader: 'css-loader',
				options: {
					modules: {
						mode: 'local',
						localIdentName: '[name]__[local]-[hash:base64:5]',
					},
				},
			}],
		}, {
			test: /\.svg$/,
			loader: 'file-loader',
			options: {
				name: 'icons/[name]-[hash:hex:8].[ext]',
			},
		}],
	},
	resolve: {
		alias: {
			'@': path.resolve('src'),
		},
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/panel.html',
			filename: 'panel.html',
		}),
		new CopyWebpackPlugin([
			'src/manifest.json',
			'src/devtool.html',
			'src/devtool.js',
			{from: 'src/style/icons', to: 'icons'},
		]),
		...(isDevServer ? [
			new webpack.HotModuleReplacementPlugin()
		] : []),
	],
	watch: mode === 'development',
	devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
	devServer: {
		port: 8080,
		hot: true,
		inline: true,
		stats: 'minimal',
		overlay: true,
	},
});
