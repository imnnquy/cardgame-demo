// gulp
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

var	input  = {
      'javascript': './app/js/**/*',
      'stylesheets': './app/css/**/*',
      'bower_components': './app/bower_components/**',
      'html_files': './app/**/*.html',
      'image_files': './app/img/**/*'
    },

    output = {
      'dist_all': './dist/*',
      'javascript': './dist/js/',
      'stylesheets': './dist/css/',
      'bower_components': 'dist/bower_components',
      'html_files': 'dist/',
      'image_files': 'dist/img/'
    };

/* Tasks definition */

// Clean dist folder
gulp.task('clean', function() {
    gulp.src(output.dist_all)
      .pipe(clean({force: true}));
});
// Minify css
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src([input.stylesheets])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest(output.stylesheets))
});
//Minify js
gulp.task('minify-js', function() {
  gulp.src([input.javascript])
  	//only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(gulp.dest(output.javascript))
});
// Copy bower components
gulp.task('copy-bower-components', function () {
  gulp.src(input.bower_components)
    .pipe(gulp.dest(output.bower_components));
});
// Copy html files
gulp.task('copy-html-files', function () {
  gulp.src(input.html_files)
    .pipe(gulp.dest(output.html_files));
});
// Copy images
gulp.task('copy-images', function () {
  gulp.src(input.image_files)
    .pipe(gulp.dest(output.image_files));
});
// Connect dist to port
gulp.task('connectDist', function () {
  connect.server({
    root: output.html_files,
    port: 8888
  });
});


/* Watch these files for changes and run the task on update */
gulp.task('watch', function() {
  gulp.watch(input.javascript, function() {
      console.log("javascript changed");
      gulp.start('minify-js');
  });

  gulp.watch(input.stylesheets, ['minify-css']);
  gulp.watch(input.html_files, ['copy-html-files']);
  gulp.watch(input.image_files, function() {
      console.log("images changed");
      gulp.start('copy-images');
  });
});


// Default task, build and watch for changes
gulp.task('default1', function() {
  runSequence(
    ['clean'],
    ['minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'copy-images', 'connectDist', 'watch']
  );
});
gulp.task('default', ['minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'copy-images', 'connectDist', 'watch']);