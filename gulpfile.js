var
  gulp = require('gulp'),
  jsonServer = require('gulp-json-srv'),
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

  jsonServer.start({
    data: 'models/Teapot.json',
    port: 3002
  });

  gulp.watch("./js/*.js").on("change", bs.reload);
  gulp.watch("./vendors/*.js").on("change", bs.reload);
  gulp.watch("./**/*.html").on("change", bs.reload);

});

gulp.task('default', ['serve']);
