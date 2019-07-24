module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    rootMode: "upward"
                }
            }
          }
        ]
      },
      resolve: {
        extensions: ['*', '.js']
      },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    }
  };