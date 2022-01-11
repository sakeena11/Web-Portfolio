const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { src, series, parallel, dest, watch } = require('gulp');

const jsPath = 'js/*.js';
const cssPath = 'css/*.css';

// function copyHtml() {
//   return src('*.html').pipe(gulp.dest('dist'));
// }

function manifestFile() {
  return src('*.webmanifest').pipe(gulp.dest('dist'));
}

// Task to minify HTML
// function minifyHTML() {
//   return gulp.src('*.html')
//   .pipe(htmlmin())
//   .pipe(gulp.dest('dist'));
// }

// Gulp task to minify HTML files
function minifyHTML() {
  return gulp
    .src(['*.html'])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest('dist'));
}

// Images Basic

function imgTask() {
  return src('images/**/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

// Images Advanced

// function imgTask() {
//   return (
//     gulp
//       .src('images/**/*')
//       .pipe(
//         imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
//       )
//       // .pipe(livereload(server))
//       .pipe(gulp.dest('dist/images'))
//   );
//   // .pipe(notify({ message: 'Images task complete' }));
// }

function imgTaskFavIcons() {
  return src('*.png').pipe(imagemin()).pipe(gulp.dest('dist'));
}

function jsTask() {
  return (
    src(jsPath)
      .pipe(sourcemaps.init())
      // .pipe(concat('all.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/js'))
  );
}

function cssTask() {
  return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(), cssnano()])) //not all plugins work with postcss only the ones mentioned in their documentation
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}

// function watchTask() {
//   watch([cssPath, jsPath], { interval: 1000 }, parallel(cssTask, jsTask));
// }

exports.manifestFile = manifestFile;
exports.minifyHTML = minifyHTML;
exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.imgTaskFavIcons = imgTaskFavIcons;

exports.default = series(
  parallel(manifestFile, minifyHTML, cssTask, jsTask, imgTask, imgTaskFavIcons)
  //   ,watchTask
);
