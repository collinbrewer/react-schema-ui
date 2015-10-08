var gulp = require("gulp");
var browserify = require('browserify');
var watchify = require("watchify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var shell = require("gulp-shell");
var reactify = require("reactify");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var watch;

// test the project
gulp.task("test", shell.task([
   "mocha test"
]));

// build the project
gulp.task("build", function() {
   watch = false;
   return buildJS();
});

// explicitly watch the static assets and use watchify to watch the js
gulp.task("watch", ["build"], function() {
   // gulp.watch("./demo/**", ["build"]);

   watch = true;
   return buildJS();
});

// serves the build dir
gulp.task("serve", ["watch"], function() {
   browserSync({
      server: {
         baseDir: "./demo"
      }
   });
});

function buildJS() {

   var browserifyBundler = browserify({
         entries: ["./demo/main.js"],
         debug: true
      })
      .transform(reactify);

   if(watch) {
      // if watch is enable, wrap this bundle inside watchify
      browserifyBundler = watchify(browserifyBundler);
      browserifyBundler.on('update', function() {
         console.log("watchify observed an update, building...");
         buildWithBrowserifyBundler(browserifyBundler);
         console.log("done");
      });
   }

   return buildWithBrowserifyBundler(browserifyBundler);
}

function buildWithBrowserifyBundler(browserifyBundler) {

   return browserifyBundler
      .bundle()
      .pipe(source("main.build.js"))
      .pipe(buffer())
      .pipe(gulp.dest("./demo/"))
      .pipe(reload({stream:true}));
}

gulp.task("default", ["build"]);
