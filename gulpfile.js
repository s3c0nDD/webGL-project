var
  gulp = require('gulp'),
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
  gulp.watch("./**/*.html").on("change", bs.reload);

});

gulp.task('default', ['serve']);
