var path = require('path');

module.exports = {
  entry: {
    // courseScanner: './src/course-scan/course-scanner.js',
    test: './test.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].user.js'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')]
  }
};
