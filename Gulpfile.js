//
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    uglify = require('gulp-uglify');

// Compile
gulp.task('compile', function() {
  return gulp.src('index.js')
             .pipe(uglify())
             .pipe(gulp.dest('dist'));
});

// Test
gulp.task('test', function() {
  return gulp.src('test/**/*.js')
             .pipe(mocha());
});

gulp.task('watch', function() {
  return gulp.watch('index.js', ['compile']);
});

// Default task
gulp.task('default', ['compile', 'test']);
