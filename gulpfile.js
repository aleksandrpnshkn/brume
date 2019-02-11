const { src, dest, watch, task, series, parallel } = require('gulp'),
      fs = require('fs'),
      rename = require('gulp-rename'),
      del = require('del'),
      plumber = require('gulp-plumber'),
      changed = require('gulp-changed');

const less = require('gulp-less'),
      csso = require('gulp-csso'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer');

const htmlmin = require('gulp-htmlmin');

const pug = require('gulp-pug');

const uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      flatten = require('gulp-flatten');

const imagemin = require('gulp-imagemin'),
      jpegRecompress = require('imagemin-jpeg-recompress'),
      pngquant = require('imagemin-pngquant'),
      webp = require('gulp-webp'),
      svgstore = require('gulp-svgstore');

const browserSync = require('browser-sync').create(),
      ghPages = require('gulp-gh-pages');

const clean = () => del(['build/', 'prebuild/']);

const css = () => {
  return src('source/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest('prebuild/css/'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(dest('build/css/'));
};

const copy = {
  fonts() {
    return src('source/fonts/**/*.{woff,woff2}')
      .pipe(dest('build/fonts/'));
  },
  video() {
    return src('source/blocks/**/*.{mp4,ogg,webm}')
      .pipe(dest('build/blocks/'));
  },
  favicon() {
    return src('source/favicon/*.{ico,png,svg,xml,webmanifest}')
      .pipe(dest('build/'));
  },
  dependencies() {
    return src([
      'node_modules/picturefill/dist/picturefill.min.js',
      'node_modules/svg4everybody/dist/svg4everybody.min.js',
      'node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(dest('build/js/'))
  }
};

const uglifyJs = () => {
  return src(['source/js/*.js',
                  'source/blocks/**/*.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(dest('prebuild/js/'));
};

const concatJs = () => {
  return src([
    'prebuild/js/utils.js',
    'prebuild/js/media.js',
    'prebuild/js/switches/switches.js',
    'prebuild/js/controls/controls.js',
    'prebuild/js/carousel/carousel.js',
    'prebuild/js/intro/intro.js',
    'prebuild/js/portfolio/portfolio.js',
    'prebuild/js/services/services.js',
    'prebuild/js/demo/demo.js',
    'prebuild/js/feedback/feedback.js',
    'prebuild/js/reviews/reviews.js',
    'prebuild/js/main.js'
  ])
    .pipe(flatten())
    .pipe(concat('script.min.js'))
    .pipe(dest('build/js/'));
};

const generateHtml = () => {
  const getPath = (block) => `source/blocks/${block}/${block}.json`;

  return src('source/index.pug')
    .pipe(pug({
      locals: {
        intro: JSON.parse(fs.readFileSync( getPath('intro'))),
        features: JSON.parse(fs.readFileSync( getPath('features'))),
        portfolio: JSON.parse(fs.readFileSync( getPath('portfolio'))),
        services: JSON.parse(fs.readFileSync( getPath('services'))),
        stages: JSON.parse(fs.readFileSync( getPath('stages'))),
        reviews: JSON.parse(fs.readFileSync( getPath('reviews')))
      },
      pretty: true
    }))
    .pipe(dest('prebuild/'));
};

const minifyHtml = () => {
  return src('prebuild/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('build/'));
};

const optimizeImages = {
  dev() {
    return src(['source/**/*.{png,jpg,svg}',
                    '!source/favicon/**'])
      .pipe(plumber())
      .pipe(changed('build/'))
      .pipe(imagemin([imagemin.svgo()]))
      .pipe(dest('build/'));
  },
  prod() {
    return src(['source/**/*.{png,jpg,svg}',
                    '!source/favicon/**'])
    .pipe(plumber())
    .pipe(changed('build/'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo(),
      pngquant({
        quality: '60-70'
      }),
      jpegRecompress({
        quality: 'high',
        min: 60,
        max: 90
      })
    ], {
      verbose: true
    }))
    .pipe(dest('build/'));
  }
};

const svgSprite = () => {
  return src(['build/img/icons/*.svg',
                   'build/blocks/logo/**/*.svg'])
    .pipe(plumber())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img/'));
}

const convertWebp = () => {
  return src('build/blocks/**/*{jpg,png}', {base: 'build/'})
    .pipe(plumber())
    .pipe(changed('build/', {extension: '.webp'}))
    .pipe(webp({
      quality: 90
    }))
    .pipe(dest('build/'));
};

const serve = () => {
  browserSync.init({
    server: 'build/',
    watch: true,
    ui: false
  });
};

const observe = () => {
  watch('source/**/*.less', series('style'));
  watch('source/**/*.pug', series('html'));
  watch('source/**/*.js', series('js'));
};

const deployGhPages = () => {
  return src('build/**/*')
    .pipe(ghPages());
};

task('html', series(generateHtml, minifyHtml));
task('style', series(css));
task('images:dev', series(optimizeImages.dev, convertWebp, svgSprite));
task('images', series(optimizeImages.prod, convertWebp, svgSprite));
task('js', series(uglifyJs, concatJs));
task('build', series(
    clean,
    copy.fonts,
    copy.video,
    copy.favicon,
    copy.dependencies,
    'js',
    'images',
    parallel('html', 'style')
  ));
task('serve', parallel(serve, observe));
task('deploy', series(deployGhPages));
