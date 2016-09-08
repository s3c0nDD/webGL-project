var
  gulp = require('gulp'),
  webserver = require('gulp-webserver');
  browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('serve', function () {

  bs = browserSync.init({
    open: true,
    startPath: "/index.html",
    server: {
      baseDir: "./",
      directory: true
    },
    files: [
      "./*"
    ]
  });

  gulp.watch("./*.js").on("change", bs.reload);
  gulp.watch("./js/*.js").on("change", bs.reload);
  gulp.watch("./vendors/*.js").on("change", bs.reload);
  gulp.watch("./**/*.html").on("change", bs.reload);

});

gulp.task('default', ['serve']);
