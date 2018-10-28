const { series, parallel } = require("gulp"),
      gulp = require("gulp"),
      rename = require("gulp-rename"),
      del = require("del"),
      plumber = require("gulp-plumber"),
      changed = require("gulp-changed");

const less = require("gulp-less"),
      csso = require("gulp-csso"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer");

const htmlmin = require("gulp-htmlmin");

const imagemin = require("gulp-imagemin"),
      jpegRecompress = require("imagemin-jpeg-recompress"),
      pngquant = require("imagemin-pngquant"),
      webp = require("gulp-webp");

const browserSync = require("browser-sync").create(),
      reload = browserSync.reload,
      ghPages = require("gulp-gh-pages");

function clean() {
  return del("build/")
}

function css() {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest("source/css/"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css/"));
}

function copy() {
  return gulp.src("source/fonts/**/*")
    .pipe(gulp.dest("build/fonts/"));
}

function htmlMinify() {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin())
    .pipe(gulp.dest("build/"));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "build/"
    },
    ui: false,
    files: "build/**/*"
  });
}

function observe() {
  gulp.watch("source/less/**/*.less", series("style"));
  gulp.watch("source/**/*.html", series("html"));
}

gulp.task("html", series(htmlMinify));
gulp.task("style", series(css));
gulp.task("image", series(htmlMinify));
gulp.task("build", series(
    clean,
    copy,
    parallel("html", "style")
  ));
gulp.task("serve", parallel(serve, observe));