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

// notification
gulp.task('notify', function() {
  console.log('====================== Test Runned ' + new Date().getTime() + ' Dance \\o/ ======================');
});

gulp.task('watch', function() {
  return gulp.watch(
    ['index.js','test/**/*.js'],
    ['compile', 'test', 'notify']);
});

// Default task
gulp.task('default', ['compile', 'watch', 'test']);

// node-debug $(which gulp)
