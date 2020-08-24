const path = require('path');

module.exports = {
    entry:"./src/frontend/index.js",
    watch:true,

    module:{
        rules: [
            {
                test:/\.js$/,
                test: /\.jsx$/,
                exclude: [path.resolve(__dirname, './src/backend')],
                exclude: /node_modules/,
                use: ['babel-loader']
            } /*,
            {
                test: /\.css$/,
                exclude: [path.resolve(__dirname, './src/backend')],
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            },
                            sourceMap: true
                        }
                     },
                     {
                         loader: 'postcss-loader',
                         options: {
                             ident: 'postcss',
                         }
                      }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]'
            } */
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx']
    }
}

