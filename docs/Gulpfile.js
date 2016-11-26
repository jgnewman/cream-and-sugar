var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    sequence = require('run-sequence'),
    creamify = require('creamify')
    reload = browserSync.reload;

/**
 * Cleaning dist/ folder
 */
gulp.task('clean', function(cb) {
  return gulp.src(['css/**', 'js/**'], { read: false })
             .pipe(clean());
})

/**
 * Running livereload server
 */
.task('server', function() {
  browserSync.init({
    server: {
     baseDir: './'
    }
  });
})

/**
 * sass compilation
 */
.task('sass', function() {
  return gulp.src('scss/app.scss')
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(gulp.dest('assets/css'));
})

/**
 * js compilation
 */
.task('js', function() {
  return browserify({entries: ['cream/app.cream'], extensions: ['.cns', '.cream']})
  .transform(creamify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('assets/js'));
})

/**
 * watch files and recompile
 */
.task('watch', function () {
  return gulp.watch(
    ['cream/**/*.cream', 'scss/**/*.scss', 'index.html'],
    function () {
      return sequence('sass', 'js', browserSync.reload);
    }
  );
})

/**
 * compile resources and run a server
 */
.task('serve', function(done) {
  return sequence('clean', ['sass', 'js'], 'server', 'watch', done);
});;
