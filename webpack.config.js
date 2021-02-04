const path = require('path');

module.exports = {
  entry: './scripts/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'style'),
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ],
      }
    ]
  }
};