const path                                      = require('path');
const MiniCssExtractPlugin                      = require('mini-css-extract-plugin');

const pathProjectRoot = path.resolve(__dirname, '../');
const pathDist = path.resolve(pathProjectRoot, 'dist');

module.exports = {
    entry : './src/index.tsx',
    plugins : [
        new MiniCssExtractPlugin({
            filename : 'index.css',
        }),
    ],
    externals : {
        react : 'React',
    },
    module : {
        rules : [
            {
                test : /\.less$/u,
                use : [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                exclude : /node_modules/u,
                test : /\.(ts|tsx)?$/u,
                use : [
                    {
                        loader : 'ts-loader',
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
        extensions : ['.tsx', '.ts', '.js'],
        symlinks : true,
    },
    output : {
        filename : 'index.js',
        path : pathDist,
        library : 'Mindmap',
        libraryExport : 'default',
        libraryTarget : 'umd',
    },
};
