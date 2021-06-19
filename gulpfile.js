 const gulp = require('gulp');
const sass = require('gulp-sass');
 const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const concatCss = require('gulp-concat-css');
//const childProcess = require('child_process');
const browserSync = require('browser-sync').create();
//const spawn = require('cross-spawn');
 const {exec} = require('child_process');


function style() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError)).pipe(postcss([autoprefixer({
            overrideBrowserslist:
                "last 2 version",
            cascade: false
        })
        ])).pipe(concatCss("style.css"))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('./_site/css'))
        .pipe(browserSync.reload({stream: true}));
}



function browserSyncServer(done) {
    browserSync.init({
        server: {
            baseDir: '_site',

        },
        reloadDelay: 500
    });
    done();
}

function jekyllClean() {
    return ()=>exec('npm run clean')
}

function jekyllBuild() {
    return ()=>exec('npm run build')
}

function browserSyncReload(done) {
    browserSync.reload()
    done();
}

function watch() {

    gulp.watch('scss/**/*.scss', style);

    gulp.watch(
        [
            '*.html',
            '_layouts/*',
            '_posts/*',
            '_includes/*',
            'images/**/*',
            'js/**/*'
        ],
        gulp.series(jekyllClean,jekyllBuild, browserSyncReload));
}

gulp.task('default', gulp.parallel(jekyllClean,jekyllBuild, browserSyncServer, watch));
