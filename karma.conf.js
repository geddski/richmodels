module.exports = function(config) {
  config.set({
    // basePath: '../..',
    frameworks: ['mocha', 'chai'],
    files: [
      'lib/angular.js',
      'lib/**/*.js',
      'app.js',
      '**/*.js',
      'test/**/*.js'
    ],
    browsers: ['Chrome'],
    autoWatch: true
  });
}; 