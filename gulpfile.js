var gulp = require('gulp');
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
var modRewrite = require('connect-modrewrite');

gulp.task('clean:css', function () {  
  del.sync('app/styles/*.css');
});

gulp.task('clean:build', function () {  
  del.sync('dist/', {force: true})
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

gulp.task('watch', function () {
  gulp
    .src(['app/styles/**/*.less', '!app/styles/materialFix.less'], {read: false})
    .pipe(watch(function () {
      return gulp
        .src('app/styles/main.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/'))
        .pipe(connect.reload());
  }));

  gulp
    .src('app/styles/materialFix.less')
    .pipe(watch())
    .pipe(less())
    .pipe(gulp.dest('app/styles/'))
    .pipe(connect.reload());

  gulp
    .src(['app/scripts/**/*.js', 'app/**/*.html'])
    .pipe(watch())
    .pipe(plumber())
    .pipe(connect.reload());
});

gulp.task('server', ['less', 'connect', 'watch']);
gulp.task('build', ['clean:build', 'minify']);

