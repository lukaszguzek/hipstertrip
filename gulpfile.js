var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    sync = require('browser-sync').create(),
    prefix = require('gulp-autoprefixer'),
    srcCss = './src/css/',
    srcJs = './src/js/',
    srcHtml = './src/*.html',
    appFolder = './app/',
    appHtml = './app/',
    targetCss = './app/css/',
    targetJs = './app/js';

gulp.task('cleanHtml', function () {
    return gulp.src('./app/*.html', {read: false})
        .pipe(clean());
})

gulp.task('buildHtml', ['cleanHtml'], function () {
    return gulp.src(srcHtml)
        .pipe(gulp.dest(appHtml))
        .pipe(sync.stream());
})

gulp.task('cleanCss', function () {
    return gulp.src(targetCss + '*.css')
            .pipe(clean());
})


gulp.task('buildCss', ['cleanCss'], function () {
    gulp.src('./src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefix())
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css/'))
        .pipe(sync.stream());
})

gulp.task('cleanJs', function () {
    gulp.src('./app/js/main.js')
    .pipe(clean());
})

gulp.task('buildJs', ['cleanJs'], function () {
    return gulp.src('./src/js/main/*.js')
        .pipe(sourcemaps.init())
        /*.pipe(uglify())*/
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/js/'))
        .pipe(sync.stream())
})

gulp.task('cleanJsSubpage', function () {
    gulp.src('./app/js/subpage.js')
    .pipe(clean());
})

gulp.task('buildJsSubpage', ['cleanJsSubpage'], function () {
    return gulp.src('./src/js/subpage/*.js')
        .pipe(sourcemaps.init())
        /*.pipe(uglify())*/
        .pipe(concat('subpage.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/js/'))
        .pipe(sync.stream())
})

gulp.task('watch', function () {
    sync.init({
        server: {
            baseDir: './app/',
            index: 'index.html',
            port: 3010
        }
    });


    gulp.watch('./src/less/*.less', ['buildCss']);
    gulp.watch(srcHtml, ['buildHtml']);
    gulp.watch('./src/js/main/*.js', ['buildJs']);
    gulp.watch('./src/js/subpage/*.js', ['buildJsSubpage']);
});
