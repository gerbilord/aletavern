const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/frontend/index.jsx'],

    watch: true,

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // babel loading in js and jsx files
                exclude: [
                    path.resolve(__dirname, './src/backend'),
                    /node_modules/,
                ],
                use: ['babel-loader'],
            },
            {
                test: /\.css$/, // css modules
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                ],
                include: /\.module\.css$/,
                exclude: [
                    path.resolve(__dirname, './src/backend'),
                    /node_modules/,
                ],
            },
            {
                test: /\.css$/, // Css non-modules
                use: ['style-loader', 'css-loader'],
                exclude: [
                    path.resolve(__dirname, './src/backend'),
                    /node_modules/,
                    /\.module\.css$/,
                ],
            },
            /*,
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]'
            } */
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            Frontend: path.resolve(__dirname, './src/frontend'),
            Utils: path.resolve(__dirname, './src/frontend/utils'),
            Games: path.resolve(__dirname, './src/frontend/games'),

            // GAME LIST
            Icebreaker: path.resolve(
                __dirname,
                './src/frontend/games/icebreaker'
            ),
        },
    },
};
