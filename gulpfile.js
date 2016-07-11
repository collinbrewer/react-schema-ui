var gulp = require("gulp");
var browserify = require('browserify');
var watchify = require("watchify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var shell = require("gulp-shell");
var reactify = require("reactify");
var browserSync = require("browser-sync");
var notify=require("gulp-notify");
var reload = browserSync.reload;
var browserifyCSS = require("browserify-css")

var watch;

// test the project
gulp.task("s", shell.task([
   "mocha test"
]));

// build the project
gulp.task("start", function() {
   watch = true;
   gulp.start("build", "watch");
});

// explicitly watch the static assets and use watchify to watch the js
gulp.task("watch", function() {
   // gulp.watch("./demo/**", ["build"]);

   watch = true;
   return buildJS();
});

// serves the build dir
gulp.task("serve", ["watch"], function() {
   browserSync({
      server: {
         baseDir: "./",
         index: "demo/index.html"
      }
   });
});

function buildJS() {

   var browserifyBundler = browserify({
         entries: ["./demo/main.js"],
         debug: true,
         package: {},
         cache: {}
      })
      .transform(browserifyCSS, {
         autoInject: true,
         // globals: true,
         minify: false,
         verbose: true
      })
      .transform(reactify);

   if(watch) {
      // if watch is enable, wrap this bundle inside watchify
      browserifyBundler = watchify(browserifyBundler);
      browserifyBundler.on('update', function() {
         console.log("watchify observed an update, building...");
         buildDemoWithBrowserifyBundler(browserifyBundler);
         console.log("done");
      });
   }

   return buildDemoWithBrowserifyBundler(browserifyBundler);
}

function buildDemoWithBrowserifyBundler(browserifyBundler) {

   return browserifyBundler
      .bundle()
      .on("error", handleError)
      .pipe(source("main.build.js"))
      .pipe(buffer())
      .pipe(gulp.dest("./demo/"))
      .pipe(reload({stream:true}));
}

var handleError=function(e){
   this.emit("end");
};
