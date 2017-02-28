var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/json-faker.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'json-faker.js',
        library: ['jsonFaker']
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }]
    }
}
