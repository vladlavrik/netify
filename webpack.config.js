/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {GitRevisionPlugin} = require('git-revision-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, {mode} = {}) => ({
	mode,
	entry: {
		background: './src/background.ts',
		devtool: './src/devtool.ts',
		application: './src/application.ts',
		sandbox: './src/sandbox.ts',
	},
	output: {
		publicPath: '/',
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
	},
	stats: {
		all: false,
		timings: true,
		builtAt: true,
		errors: true,
		errorDetails: true,
		performance: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					onlyCompileBundledFiles: true,
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: {
								namedExport: false,
								mode: 'local',
								localIdentName: '[name]__[local]-[hash:base64:5]',
							},
						},
					},
					{
						loader: 'postcss-loader',
					},
				],
			},
			{
				test: /\.svg$/,
				loader: '@svgr/webpack',
				options: {
					name: 'Icon',
				},
			},
			{
				test: /\.png$/,
				loader: 'file-loader',
				options: {
					name: 'icons/[hash:hex:8].[ext]',
				},
			},
		],
	},
	resolve: {
		alias: {
			'@': path.resolve('src'),
		},
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/devtool.html',
			filename: 'devtool.html',
			chunks: ['devtool'],
		}),
		new HtmlWebpackPlugin({
			template: './src/application.html',
			filename: 'application.html',
			chunks: ['application'],
		}),
		new HtmlWebpackPlugin({
			template: './src/sandbox.html',
			filename: 'sandbox.html',
			chunks: ['sandbox'],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name]-[id].css',
		}),
		new CopyWebpackPlugin({
			patterns: ['./src/manifest.json', {from: './src/style/icons', to: 'icons'}],
		}),
		...(mode === 'production'
			? [new CleanWebpackPlugin(), new GitRevisionPlugin(), new ZipPlugin({filename: 'netify'})]
			: []),
	],
	watch: mode === 'development',
	devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
});
