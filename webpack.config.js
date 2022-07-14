const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'pgl.js',
    path: path.resolve(__dirname, 'build'),
  }
};