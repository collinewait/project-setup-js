const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
              },
        ]
      },
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true
  }
};

  