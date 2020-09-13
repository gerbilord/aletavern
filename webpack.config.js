const path = require('path');

module.exports = {
    entry:"./src/frontend/index.jsx",
    watch:true,

    module:{
        rules: [
            {
                test:/\.js$/,
                exclude: [path.resolve(__dirname, './src/backend')],
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.jsx$/,
                exclude: [path.resolve(__dirname, './src/backend')],
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                exclude: [path.resolve(__dirname, './src/backend')],
                exclude: /node_modules/,
                use:['style-loader', 'css-loader']
            }/*,
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

