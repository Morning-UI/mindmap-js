const path                                      = require('path');
const VueLoaderPlugin                           = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin                      = require('mini-css-extract-plugin');

const pathProjectRoot = path.resolve(__dirname, '../');
// const pathNpm = path.resolve(pathProjectRoot, 'node_modules');
const pathDist = path.resolve(pathProjectRoot, 'dist');

module.exports = {
    entry : './src/index.ts',
    plugins : [
        new MiniCssExtractPlugin({
            filename : 'index.css',
        }),
        new VueLoaderPlugin(),
    ],
    externals : {
        vue : 'Vue',
    },
    module : {
        rules : [
            {
                test : /\.less$/u,
                use : [
                    process.env.NODE_ENV !== 'production'
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test : /\.vue$/u,
                use : [
                    {
                        loader : 'vue-loader',
                    },
                ],
            },
            {
                exclude : /node_modules/u,
                test : /\.ts?$/u,
                use : [
                    {
                        loader : 'ts-loader',
                        options : {
                            appendTsSuffixTo : [/\.vue$/u],
                        },
                    },
                ],
            },
            {
                test : /\.woff$/u,
                exclude : /node_modules/u,
                use : [{
                    loader : 'url-loader',
                }],
            },
        ],
    },
    resolve : {
        extensions : ['.tsx', '.ts', '.js', '.vue'],
        symlinks : true,
    },
    output : {
        filename : 'index.js',
        path : pathDist,
        library : 'Mindmap',
        libraryExport : 'default',
        libraryTarget : 'umd',
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             styles: {
    //                 name: 'styles',
    //                 test: /\.(less|css)$/,
    //                 chunks: 'all',
    //                 enforce: true,
    //             },
    //         },
    //     },
    // },
};
