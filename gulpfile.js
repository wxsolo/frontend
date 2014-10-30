var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var del = require('del');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var usemin = require('gulp-usemin');
var htmlmin = require('gulp-htmlmin');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var coffee = require('gulp-coffee');
var modRewrite = require('connect-modrewrite');

gulp.task('clean:css', function () {  
  del.sync('app/styles/*.css');
});

gulp.task('clean:build', function () {  
  del.sync('dist/', {force: true})
});

gulp.task('less', ['clean:css'], function () {
  var stream = gulp
    .src(['app/assets/styles/*.less'])
    .pipe(less())
    .pipe(gulp.dest('app/assets/styles/dist/'));
  return stream;
});

gulp.task('connect', function () {
  connect.server({
    root: './app',
    port: 9000,
    livereload: true,
    middleware: function (connect, o) {
      return [
        (function () {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse('http://localhost:4000/api');
          options.route = '/api';
          return proxy(options);
        })(),
        modRewrite([
         '!\\.html|\\.js|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.gif|\\.eot|\\.woff|\\.ttf|\\.svg$ /index.html'
        ])
      ];
    }
  });
});

gulp.task('coffee', function() {
  gulp.src('app/assets/scripts/*.coffee')
    .pipe(coffee({bare: false}))
    .pipe(gulp.dest('app/assets/scripts/dist/'))
});

gulp.task('watch', function () {
  gulp
    .src(['app/assets/styles/*.less'], {read: false})
    .pipe(watch(function () {
      return gulp
        .src('app/assets/styles/main.less')
        .pipe(less())
        .pipe(gulp.dest('app/assets/styles/dist/'))
        .pipe(connect.reload());
  }));

  gulp
    .src('app/assets/scripts/*.coffee')
    .pipe(watch())
    .pipe(coffee())
    .pipe(gulp.dest('app/assets/scripts/dist/'))
    .pipe(connect.reload());

  gulp
    .src(['app/**/*.html'])
    .pipe(watch())
    .pipe(plumber())
    .pipe(connect.reload());
});

gulp.task('server', ['connect', 'watch','coffee']);
gulp.task('build', ['clean:build', 'minify']);

