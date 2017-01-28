var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var typescriptSources = ['scripts/*.ts'],
    jsSources = ['scripts/*.js'],
    sassSources = ['styles/*.scss'],
    phpSources = ['*.php'],
    outputDir = 'assets';


gulp.task('sass', function() {
  return gulp.src(sassSources)
    .pipe(sass())
      .on('error', gutil.log)
    .pipe(gulp.dest('assets'))
    .pipe(browserSync.stream())
});

gulp.task('typescript', function() {
  gulp.src(typescriptSources)
    .pipe(typescript())
      .on('error', gutil.log)
    .pipe(gulp.dest('scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.stream())
});

gulp.task('connect-sync', function() {
  connect.server({
    hostname: '0.0.0.0',
    port: 8000,
    router: 'router.php'
  }, function (){
    browserSync({
      proxy: {
        target: 'localhost:8000'
      }
    });
  });

  gulp.watch(typescriptSources, ['typescript']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(phpSources).on('change', function () {
    browserSync.reload();
  });
});

gulp.task('default', ['typescript', 'js', 'sass', 'connect-sync']);