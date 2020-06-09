const merge                                     = require('webpack-merge');
const base                                      = require('./webpack.config.base.js');

module.exports = merge(base, {
    mode : 'development',
    devServer : {
        // eslint-disable-next-line no-magic-numbers
        port : 8090,
    },
});
