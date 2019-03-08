'use strict';

// REQUIRED PACKAGES
// =================

import browserify  from 'browserify';
import browserSync from 'browser-sync';
import buffer      from 'gulp-buffer';
import debug       from 'gulp-debug';
import filter      from 'gulp-filter';
import gulp        from 'gulp';
import plumber     from 'gulp-plumber';
import postCSS     from 'gulp-postcss';
import rename      from 'gulp-rename';
import sass        from 'gulp-sass';
import sourcemaps  from 'gulp-sourcemaps';
import tap         from 'gulp-tap';
import uglify      from 'gulp-uglify';
import wait        from 'gulp-wait';


// CONFIGURATION
// =============

var paths = {
    root: '/',                // Root folder of the project
    maps: {
        root:    'maps/',     // Folder for the map files, relative to the project root
        source:  '../maps/',  // Folder for the map files, relative to the source .css and .js files
    },
    public: {
        root:    'dist/',     // The public folder of the project
        css:     'dist/',     // Public CSS folder
        js:      'dist/'      // Public JavaScript folder
    },
    resources: {
        root:    'src/',      // The root resources folder
        js:      'src/js/',   // Resource JavaScript folder
        scss:    'src/scss/'  // Resource SCSS folder
    },
    sandbox: {
        root:    'sandbox/',  // The root sandbox folder
    }
};


// INITIALIZATION
// ==============

const server = browserSync.create();
const packageJSON = getPackeageJSON();


// HELPER FUNCTIONS
// ================

function getPackeageJSON() {
    var fs = require('fs');
    return JSON.parse(fs.readFileSync('./package.json'));
}

function onError(err) {
    console.error(err.message);
    browserSync.notify(err.message, 5000);
    this.emit('end');
}

function reload(done) {
    server.reload();
    done();
}

// GULP TASKS
// ==========

gulp.task('js', function() {
    return gulp.src(paths.resources.js + '**/!(_)*.js', { read: false })
        .pipe(debug({ title: 'js:' }))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(tap(function (file) {
            file.contents = browserify(file.path, { debug: true }).bundle();
        }))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(paths.maps.source))
        .pipe(gulp.dest(paths.public.js))
        .pipe(filter('**/*.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min', extname: '.js' }))
        .pipe(sourcemaps.write(paths.maps.source))
        .pipe(gulp.dest(paths.public.js));
});

gulp.task('sass', function() {
    return gulp.src(paths.resources.scss + '**/!(_)*.scss')
        .pipe(debug({ title: 'sass:' }))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['node_modules'] }))
        .pipe(sourcemaps.write(paths.maps.source))
        .pipe(gulp.dest(paths.public.css))
        .pipe(filter('**/*.css'))
        .pipe(postCSS())
        .pipe(rename({ suffix: '.min', extname: '.css' }))
        .pipe(sourcemaps.write(paths.maps.source))
        .pipe(gulp.dest(paths.public.css));
});

gulp.task('serve', function() {
    browserSync.init({
        browser: 'chrome',
        port: 44326,
        server: {
            baseDir: paths.sandbox.root,
            index: 'index.html',
            routes: {
                "/dist": "dist",
                '/maps': paths.maps.root,
                "/node_modules": "node_modules"
            },
            serveStaticOptions: {
                extensions: ['html']}}});
});

gulp.task('watch', function() {
    gulp.watch(paths.sandbox.root + '**/*.*', reload);
    gulp.watch(paths.resources.js + '**/*.js', gulp.series('js', reload));
    gulp.watch(paths.resources.scss + '**/*.scss', gulp.series('sass', reload));
});

gulp.task('build', gulp.series('sass','js'));

gulp.task('default', gulp.series('build', gulp.parallel('watch','serve')));