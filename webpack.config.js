const path = require('path');

module.exports = {
    entry:"./src/frontend/index.js",
    watch:true,

    module:{
        rules: [
            {
                test:/\.js$/,
                exclude: [path.resolve(__dirname, './src/backend')]
            }
        ],
    }
}
