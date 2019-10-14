const gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf= require('gulp-if'),
    browserSync = require('browser-sync').create();

const config = {
    paths: {
        less : './src/less/**/*.less',
        html: './public/index.html'
    },
    output: {
        cssName : 'bundle.min.css',
        path : './public'
    },
    isDevelop : true
};

gulp.task('less',function () {
    return gulp.src(config.paths.less)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(less())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop,cleanCss()))
        .pipe(gulpIf(config.isDevelop,sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        server : {
            baseDir: config.output.path
        }
    });

    gulp.watch(config.paths.less, gulp.series('less'));
    gulp.watch(config.paths.html).on('change',function () {
        browserSync.reload()
    });
});

gulp.task('default', gulp.series('less','serve'));