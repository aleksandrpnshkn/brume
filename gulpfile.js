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

const htmlmin = require("gulp-htmlmin"),
      posthtml = require("gulp-posthtml"),
      include = require("posthtml-include");

const imagemin = require("gulp-imagemin"),
      jpegRecompress = require("imagemin-jpeg-recompress"),
      pngquant = require("imagemin-pngquant"),
      webp = require("gulp-webp"),
      svgstore = require("gulp-svgstore");

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
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css/"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css/"));
}

function copy() {
  return gulp.src("source/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest("build/fonts/"));
}

function includeHtml() {
  return gulp.src("source/*.html")
    .pipe(plumber())
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build/"));
}

function minifyHtml() {
  return gulp.src("build/*.html")
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build/"));
}

function optimizeImages() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(plumber())
    .pipe(changed("build/img/"))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo(),
      pngquant({
        quality: "60-70"
      }),
      jpegRecompress({
        quality: "high",
        min: 60,
        max: 90
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest("build/img"));
}

function svgSprite() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(plumber())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/"));
}

function convertWebp() {
  return gulp.src("build/**/*{jpg,png}")
    .pipe(plumber())
    .pipe(changed("build/", {extension: ".webp"}))
    .pipe(webp({
      quality: 90
    }))
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

gulp.task("html", series(includeHtml, minifyHtml));
gulp.task("style", series(css));
gulp.task("images", series(optimizeImages, convertWebp, svgSprite));
gulp.task("build", series(
    clean,
    copy,
    "images",
    parallel("html", "style")
  ));
gulp.task("serve", parallel(serve, observe));
