var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence');

var tsSources = ['src/scripts/ts/*.ts'],
    jsSources = ['src/scripts/js/*.js'],
    sassSources = ['src/styles/*.scss'],
    phpSources = ['src/**/*.php'],
    tsOutputDir = 'src/scripts/js',
    jsOutputDir = 'dist/js',
    cssOutputDir = 'dist/css',
    phpOutputDir = 'dist';

gulp.task('php', function() {
  gulp.src(phpSources)
    .pipe(gulp.dest(phpOutputDir))
});

gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(sass())
      .on('error', gutil.log)
    .pipe(gulp.dest(cssOutputDir))
    .pipe(browserSync.stream())
});

gulp.task('ts', function() {
  gulp.src(tsSources)
    .pipe(typescript())
      .on('error', gutil.log)
    .pipe(gulp.dest(tsOutputDir))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(jsOutputDir))
    .pipe(browserSync.stream())
});

gulp.task('connect-sync', function() {
  connect.server({
    hostname: '0.0.0.0',
    port: 8000,
    base: './dist',
    router: '../router.php'
  }, function (){
    browserSync({
      proxy: {
        target: 'localhost:8000'
      }
    });
  });

  gulp.watch(tsSources, ['ts']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(phpSources).on('change', function() {
    runSequence('php', function() {
      browserSync.reload();
    });
  });
});

gulp.task('default', ['php', 'ts', 'js', 'sass', 'connect-sync']);