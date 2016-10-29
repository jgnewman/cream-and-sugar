import 'babel-core/register';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mocha from 'gulp-mocha';
import sequence from 'run-sequence';
import jison from 'jison';
import fs from 'fs';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import server from 'gulp-server-livereload';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import { argv } from 'yargs';
import { compile } from './src/compiler/compiler';
import repl from './repl/index';

function handle(err) {
  gutil.log(err);
  process.exit(1);
}

gulp.task('genparser', next => {
  fs.readFile('./src/grammar/grammar.jison', (err, result) => {
    err && handle(err);
    const parser = new jison.Parser(result.toString());
    fs.writeFile('./src/parser/parser.js', parser.generate(), (err, result) => {
      err ? handle(err) : next();
    });
  });
});

gulp.task('sanitycheck', next => {
  compile('./test/sanitycheck.cream', null, {log: true, finalize: true});
  gutil.log('Sanity check passed. Consider running `gulp test` as well.');
  next();
});

gulp.task('test', next => {
  return gulp.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('private:build-test-irl', next => {
  compile('./test-irl/src/app.cream', function (err, result) {
    if (err) throw err;
    fs.writeFile('./test-irl/.browserifycache.js', result, function (err) {
      if (err) throw err;
      browserify('./test-irl/.browserifycache.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./test-irl/output/'));
      next();
    });
  }, {finalize: true});
});

gulp.task('private:serve', () => {
  return gulp.src('./test-irl/output')
      .pipe(server({
        livereload: true,
        directoryListing: false,
        open: true
      }));
});

gulp.task('test-irl', () => {
  sequence('private:build-test-irl', 'private:serve', () => {
    gulp.watch('./test-irl/src/app.cream', () => sequence('private:build-test-irl'));
  });
});

gulp.task('distribute', next => {
  return gulp.src('src/**/**/*.js')
        .pipe(babel({
          presets: ['es2015'],
          plugins: ['transform-es2015-modules-commonjs', 'add-module-exports']
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('repl', () => {
  repl();
});
