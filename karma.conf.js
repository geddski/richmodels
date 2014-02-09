module.exports = function(config) {
  config.set({
    // basePath: '../..',
    frameworks: ['mocha', 'chai'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      '**/*.js',
      'test/**/*.js'
    ],
    autoWatch: true
  });
}; 