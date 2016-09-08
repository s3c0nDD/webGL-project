var
  gulp = require('gulp'),
  webserver = require('gulp-webserver');
  browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('serve', function () {

  bs = browserSync.init({
    open: true,
    server: {
      baseDir: "./"
    },
    files: "./*"
  });

  gulp.watch("./js/*.js").on("change", bs.reload);
  gulp.watch("./vendors/*.js").on("change", bs.reload);
  gulp.watch("./**/*.html").on("change", bs.reload);

});

gulp.task('webserver', function () {

  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: false
    }));

});

gulp.task('default', ['webserver','serve']);
