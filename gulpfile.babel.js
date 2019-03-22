import gulp from "gulp"
import cp from "child_process"
import gutil from "gulp-util"
import postcss from "gulp-postcss"
import cssImport from "postcss-import"
import cssnext from "postcss-cssnext"
import BrowserSync from "browser-sync"
import webpack from "webpack"
import webpackConfig from "./webpack.conf"
import svgstore from "gulp-svgstore"
import svgmin from "gulp-svgmin"
import inject from "gulp-inject"
import cssnano from "cssnano"
import tailwindcss from 'tailwindcss'

const browserSync = BrowserSync.create()
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`
const defaultArgs = ["-d", "../dist", "-s", "site"]

if (process.env.DEBUG) {
  defaultArgs.unshift("--debug")
}

gulp.task("css", gulp.series(() => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([
      cssImport({from: "./src/css/main.css"}),
      tailwindcss('./tailwind.js'),
      cssnext(),
      //cssnano(),
    ]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
  
)))

/*
gulp.task("svg", gulp.series(() => {
  const svgs = gulp.src("site/static/img/icons-*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))

  function fileContents(filePath, file) {
    return file.contents.toString()
  }

  return gulp.src("site/layouts/partials/svg.html")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("site/layouts/partials/"))
}))
*/

gulp.task("js", gulp.series(cb => {
  const myConfig = Object.assign({}, webpackConfig)

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err)
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }))
    browserSync.reload()
    cb()
  })
}))

gulp.task("hugo", gulp.series( (cb) => buildSite(cb, `--ignoreCache`) ))
gulp.task("hugo-preview", gulp.series((cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"])))
gulp.task("build", gulp.series(gulp.parallel("css", "js", "hugo")))
gulp.task("build-preview", gulp.series(gulp.parallel("css", "js", "hugo-preview")))

gulp.task("server", gulp.series(gulp.parallel(["hugo", "css", "js"/*, "svg"*/], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch("./src/js/**/*.js", gulp.series(["js"]))
  gulp.watch("./src/css/**/*.css", gulp.series(["css"]))
  //gulp.watch("./site/static/img/icons-*.svg", gulp.series(["svg"]))
  gulp.watch("./site/**/*", gulp.series(["hugo"]))
})))

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false")
      cb()
    } else {
      browserSync.notify("Hugo build failed :(")
      cb("Hugo build failed")
    }
  })
}
