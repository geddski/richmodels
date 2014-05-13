module.exports = function(config) {
  config.set({
    // basePath: '../..',
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher'
    ],
    frameworks: ['mocha', 'chai'],
    files: [
      'lib/angular.js',
      'lib/**/*.js',
      'app.js',
      'model.js',
      'user.js',
      'test/**/*.js'
    ],
    browsers: ['Chrome'],
    autoWatch: true
  });
}; 