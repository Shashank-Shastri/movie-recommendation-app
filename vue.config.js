module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /@?(vue-select).*\.(ts|js)x?$/,
                    include: /node_modules/,
                    loader: 'babel-loader',
                },
            ],
        },
    },
};
