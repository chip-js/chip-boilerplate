var gulp = require('gulp');
var del = require('del');
var newer = require('gulp-newer');
var concat = require('gulp-concat');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var less = require('gulp-less');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-minify-css');
var karma = require('karma');
var liveServer = require("live-server");

var paths = {
  build: {
    dir: 'build',
    scripts: 'js',
    script: 'app.js',
    styles: 'css',
    style: 'app.css',
    images: 'img',
    locales: 'locales',
  },
  scripts: 'index.js',
  images: 'src/img/**/*',
  css: 'src/**/*.css',
  less: 'src/**/*.less',
  stylus: 'src/**/*.styl',
  locales: 'locales/**',
  files: 'public/**/*'
};

var browserifyOptions = {
  basedir: 'src',
  entries: paths.scripts,
  extensions: ['.coffee'],
  transform: ['stringify', 'coffeeify', 'require-globify'],
  debug: true,
  // Required properties for watchify
  cache: {},
  packageCache: {}
};

var postcssPlugins = [
  cssnext({ map: { inline: false } })
];


/* Register some tasks to expose to the cli */
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(scripts, images, files, locales)
));

gulp.task(clean);
gulp.task(watch);
gulp.task(test);

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series('build'));


function clean() {
  return del(paths.build.dir);
}


// Copy all static images
function images() {
  return gulp.src(paths.images)
    .pipe(newer(paths.build.images))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.build.dir + '/' + paths.build.images));
}


function styles() {
  var cssStream = gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(postcss(postcssPlugins));

  var lessStream = gulp.src(paths.less)
    .pipe(sourcemaps.init())
    .pipe(less());

  var stylusStream = gulp.src(paths.stylus)
    .pipe(sourcemaps.init())
    .pipe(stylus());

  return merge(cssStream, lessStream, stylusStream)
    .pipe(concat(paths.build.style))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build.dir + '/' + paths.build.styles));
}


// Minify and copy all JavaScript (except vendor scripts) with sourcemaps all the way down
function scripts() {
  var bundler = browserify(browserifyOptions);
  return bundler.bundle()
    .pipe(source(paths.build.script))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build.dir + '/' + paths.build.scripts));
}


function files() {
  return gulp.src(paths.files)
    .pipe(gulp.dest(paths.build.dir));
}


function locales() {
  return gulp.src(paths.locales)
    .pipe(gulp.dest(paths.build.dir + '/' + paths.build.locales));
}


function watchScripts() {
  var bundler = watchify(browserify(browserifyOptions));
  bundler.on('log', gutil.log.bind(gutil));
  bundler.on('update', function() {
    gutil.log('Rebundling');
    rebundle();
  });

  function rebundle() {
    return bundler.bundle()
      .on('error', notify.onError({
        title: 'Compile Error',
        message: function(error) {
          // Coffeescript messages don't contain the location information, add it
          var locationInfo = 'line' in error ? '(' + error.line + ':' + error.column + ')' : '';
          return error.message.replace(__dirname + '/', '') + ' ' + locationInfo;
        }
      }))
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.build.dir + '/' + paths.build.scripts));
  }

  return rebundle();
}


// Rerun the task when a file changes
function watch() {
  watchScripts();
  images();
  styles();
  files();
  locales();
  gulp.watch([paths.css, paths.less, paths.stylus], styles);
  gulp.watch(paths.images, images);
  gulp.watch(paths.files, files);
  gulp.watch(paths.locales, locales);

  liveServer.start({
    root: paths.build.dir,
    file: 'index.html',
    open: false
  });
}


function test(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
}

