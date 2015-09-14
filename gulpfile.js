'use strict';

var gulp = require('gulp')
  , sourcemaps = require('gulp-sourcemaps')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')
  , babel = require('gulp-babel');

gulp.task('compile', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', ['compile'], function() {
  return browserify({ entries: './index.js' })
    .bundle()
    .pipe(source('woody.js'))
    .on('error', function(err) {
      console.log('Error:', err.message);
    })
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['default'], function () {
  gulp.watch('./src/**/*', ['default']);
});
