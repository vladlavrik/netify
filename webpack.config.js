/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, {mode} = {}) => ({
	mode,
	entry: {
		background: './src/background.ts',
		devtool: './src/devtool.ts',
		panel: './src/panel.ts',
	},
	output: {
		publicPath: '/',
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
	},
	stats: {
		all: false,
		builtAt: true,
		errors: true,
		warnings: true,
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
							modules: {
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
				loader: 'svg-react-loader',
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
			template: './src/panel.html',
			filename: 'panel.html',
			chunks: ['panel'],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name]-[id].css',
		}),
		new CopyWebpackPlugin(['./src/manifest.json', {from: './src/style/icons', to: 'icons'}]),
		...(mode === 'production'
			? [new CleanWebpackPlugin(), new GitRevisionPlugin(), new ZipPlugin({filename: 'netify'})]
			: []),
	],
	watch: mode === 'development',
	devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
});
