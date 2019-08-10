const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const childProcess = require('child_process');
const browserSync = require('browser-sync').create();

//compile scss into css

function style() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError)).pipe(postcss([autoprefixer({
            overrideBrowserslist:
                "last 2 version",
            cascade: false
        })
        ]))
        .pipe(gulp.dest('./css'))
        .pipe(gulp.dest('./_site/css'))
        .pipe(browserSync.reload({stream: true}));
}

function browserSyncServer(done) {
    browserSync.init({
        server: {
            baseDir: '_site',

        }
    });
    done();
}

function jekyllBuild() {
    return childProcess.spawn('jekyll.bat', ['build','--config','_config.yml,_config_dev.yml' ,'--incremental'], {stdio: 'inherit'})
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watch() {

    gulp.watch('scss/**/*.scss', style);
    gulp.watch(
        [
            '*.html',
            '_layouts/*',
            '_posts/*',
            '_includes/*'
        ],
        gulp.series(jekyllBuild, browserSyncReload));
}

// exports.style=style;
// exports.watch = watch;

gulp.task('default', gulp.parallel(jekyllBuild, browserSyncServer, watch));
