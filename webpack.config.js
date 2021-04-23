const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/frontend/index.js'],

    watch: true,

    target: 'node', // in order to ignore built-in modules like path, fs, etc.

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // babel loading in js and jsx files
                include: path.resolve(__dirname, './src/frontend'),
                use: ['babel-loader'],
            },
            {
                test: /\.module\.css$/, // css modules
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
                include: path.resolve(__dirname, './src/frontend'),
            },
            {
                test: /\.css$/, // Css non-modules
                use: ['style-loader', 'css-loader'],
                include: path.resolve(__dirname, './src/frontend'),
                exclude: /\.module\.css$/,
            },
            /*,
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=10000&name=img/[name].[ext]'
            } */
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css'],
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
