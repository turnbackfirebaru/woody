'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha']
  , files: ['./test/log.js']
  , preprocessors: {
      './test/**/*.js': ['browserify']
    }
  , browserify: {
      debug: true
    , transform: ['babelify']
    }
  });
};
