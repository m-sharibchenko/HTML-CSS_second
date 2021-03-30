const {series, parallel, src, dest, watch} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpClean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const imageMin = require('gulp-imagemin');
const prefixer = require('gulp-autoprefixer')

function getPrefix() {
    return src('src/styles/*')
        .pipe(prefixer())
        .pipe(dest('build/styles'))
}

function serve() {
    browserSync.init({
        server: 'build',
        watch: true
    });
}

function clean() {
    return src('build', {read: false, allowEmpty: true})
        .pipe(gulpClean());
}

function copyHTML(_cb) {
    return src('src/index.html')
        .pipe(dest('build'));
}

function minCSS() {
    return src('src/styles/*')
        .pipe(cleanCSS())
        .pipe(concat('index.css'))
        .pipe(dest('build'));
}

function watchTasks() {
    watch('src/index.html', copyHTML);
    watch('src/styles/*', minCSS);
}

function copyImg(_cb) {
    return src('src/img/*.svg')
        .pipe(dest('build/img'));
}

function minImages() {
    return src('src/img/!(*.svg)')
        .pipe(imageMin())
        .pipe(dest('build/img'))
}

exports.prefix = getPrefix;
exports.clean = clean;
exports.watch = watchTasks;
exports.style = minCSS;
exports.img = minImages;
exports.default = series (
    clean,
    parallel (copyHTML, copyImg, getPrefix, minCSS, minImages),
    parallel (watchTasks, serve)
)