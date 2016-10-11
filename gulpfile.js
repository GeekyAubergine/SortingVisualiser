require('es6-promise').polyfill(); //Fixes error with autoprefixer
const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');

var webPackConfig = require('./webpack.config.js');

//Linters packages
const htmlhint = require("gulp-htmlhint");
const scssLint = require('gulp-scss-lint');
const eslint = require('gulp-eslint');

//Config
var production = !!util.env.production;

const gulpConfig = {
    build: "./build/",
    src: './src/',
    jsEntryPoints: ['babel-polyfill', './src/js/sortingvisualiser.js'],
};

function handleError(error) {
    util.log(error.toString());
    if (!production) {
        this.emit('end');
    } else {
        util.log('Production error');
    }
}

gulp.task("html", () => {
    return gulp.src(gulpConfig.src+ '**/*.html', {
        base: gulpConfig.src
    })
        .pipe(htmlhint().on('error', handleError))
        .pipe(htmlhint.reporter().on('error', handleError))
        .pipe(gulp.dest(gulpConfig.build))
        .on("end", browserSync.reload);
});

gulp.task("css", function() {
    return gulp.src(gulpConfig.src+ '**/*.s+(a|c)ss', { base: gulpConfig.src })
        .pipe(scssLint({
            'config': './scss-lint.yml',
        }))
        .pipe(sass({
            outputStyle: 'expanded',
            errLogToConsole: true
        }).on('error', handleError))
        .pipe(autoprefixer({
            flexbox: 'no-2009'
        }).on('error', handleError))
        .pipe(cleanCss({
            processImport: true,
            processRemoteImport: true
        }).on('error', handleError))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(gulpConfig.build))
        .pipe(browserSync.stream());
});

gulp.task('js-lint', () => {
    return gulp.src(gulpConfig.src + '**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .on('error', handleError);
});

gulp.task('js-webpack', ['js-lint'], () => {
    return gulp.src(gulpConfig.jsEntryPoints)
        .pipe(named())
        .pipe(webpack(webPackConfig).on('error', (err) => {
            util.log('WEBPACK ERROR', err);
        }))
        .on('error', (err) => {
            util.log('WEBPACK ERROR 2', err);
        })
        .pipe(gulp.dest(gulpConfig.build + 'js'))
        .pipe(browserSync.stream());
});

gulp.task('js', ['js-webpack']);

gulp.task('build-client', (cb) => {
    runSequence(['html', 'css', 'js'], cb);
});

gulp.task('clean', () => {
    return gulp.src(gulpConfig.build, {read: false})
        .pipe(clean());
});

gulp.task('browser-sync', () => {
    browserSync({
        proxy: 'sorter.dev:8001',
        port: 9001,
        open: false,
    });
});

gulp.task('build', (cb) => {
    runSequence('clean', ['build-client'], cb);
});

gulp.task('watch', ['browser-sync', 'build'], () => {
    gulp.watch(gulpConfig.src + '**/*.html', ["html"]);
    gulp.watch(gulpConfig.src + '**/*.s+(a|c)ss', ["css"]);
    gulp.watch([gulpConfig.src + '**/*.js'], ['js']);
});

gulp.task('production', (cb) => {
    production = true;
    webPackConfig = require('./webpack.config.prod.js');
    runSequence(['build'], cb);
});

gulp.task('default', (cb) => {
    runSequence(['build'], ['browser-sync'], cb);
});