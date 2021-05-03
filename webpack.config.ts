import { join } from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import GenerateJsonWebpackPlugin from 'generate-json-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import VisualizerPlugin from 'webpack-visualizer-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { name, description, version, license, author, repository, bugs, app } from './package.json'

/**
 * Package file for distributed app bundle.
 */
const metadata = {
    name,
    productName: app.name,
    description,
    version,
    license,
    author,
    repository,
    bugs,
    main: 'main.js',
}

/**
 * Config builder for webpack.
 *
 * @param _ - The webpack environment
 * @param argv - Array of webpack cli arguments
 */
export default (_, argv: any): Configuration => ({
    mode: 'production',
    target: 'electron-main',
    devtool: 'source-map',
    entry: {
        main: join(__dirname, 'src', 'main.ts'),
        renderer: join(__dirname, 'src', 'renderer.ts'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.app.json',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
        new DefinePlugin({
            VERSION: JSON.stringify(version),
            ENVIRONMENT: JSON.stringify(argv.mode),
            REPOSITORY: JSON.stringify(repository.url),
            APP_NAME: JSON.stringify(app.name),
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist', 'build'],
        }),
        new GenerateJsonWebpackPlugin('package.json', metadata, null, 2),
        new HtmlWebpackPlugin({
            template: join(__dirname, 'src', 'index.html'),
            excludeChunks: ['main'],
            minify: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: join('src', 'assets'),
                    to: 'assets',
                },
                {
                    from: 'LICENSE.md',
                    to: 'LICENSE.md',
                },
            ]
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: {
                    condition: /^\**!|@preserve|@license|@cc_on/i,
                    filename: () => '3rdpartylicenses.txt',
                },
            }),
        ],
    },
    output: {
        filename: '[name].js',
        path: join(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    stats: {
        all: false,
        errors: true,
        chunks: true,
    },
})
