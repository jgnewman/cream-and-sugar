var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sequence = require('run-sequence'),
    creamify = require('creamify'),
    panini = require('panini'),
    rename = require('gulp-rename'),
    reload = browserSync.reload;

/**
 * Cleaning dist/ folder
 */
gulp.task('clean', function(cb) {
  del(['css/**', 'js/**', 'reference/**']).then(function () {
    cb();
  });
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
 * minified js compilation
 */
.task('js:min', function() {
  return browserify({entries: ['cream/app.cream'], extensions: ['.cns', '.cream']})
  .transform(creamify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(uglify().on('error', function (e) { console.log(e) }))
  .pipe(gulp.dest('assets/js'));
})

/**
 * Compile documentation pages.
 */
.task('docs', function () {
  return gulp.src('markdown/**/*.md')
  .pipe(panini({
    root: 'markdown/',
    layouts: 'layouts/',
    helpers: 'helpers/'
  }))
  .pipe(rename(function (path) {
    path.dirname += ('/' + path.basename);
    path.basename = 'index';
    path.extname = '.html';
  }))
  .pipe(gulp.dest('reference'));
})

/**
 * watch files and recompile
 */
.task('watch', function () {
  return gulp.watch(
    [
      'cream/**/*.cream',
      'scss/**/*.scss',
      'markdown/**/*.md',
      'layouts/**/*.html',
      'index.html'
    ],
    function () {
      return sequence('sass', 'js', 'docs', browserSync.reload);
    }
  );
})

/**
 * Compile resources but don't worry about serving.
 */
.task('build', function (done) {
  return sequence('clean', ['sass', 'js', 'docs'], done);
})

/**
 * compile resources and run a server
 */
.task('serve', function(done) {
  return sequence('clean', ['sass', 'js', 'docs'], 'server', 'watch', done);
});
