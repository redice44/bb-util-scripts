var path = require('path');

module.exports = {
  entry: {
    // nameOfOutputFile: './path/to/file.js'
    CourseScanner: './src/scripts/CourseScanner.js',
    TinymceTemplates: './src/scripts/TinymceTemplates.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].user.js'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src', 'lib'),
      path.resolve(__dirname, 'src', 'interface')
    ]
  }
};
