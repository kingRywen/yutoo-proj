const gulp = require("gulp");
const loadPlugins = require("gulp-load-plugins");
const del = require("del");
const path = require("path");
const webpackStream = require("webpack-stream");

const manifest = require("./package.json");

// Load all of our Gulp plugins
const $ = loadPlugins();

// Gather the library data from `package.json`
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = config.mainVarName;

function cleanDist(done) {
  del([destinationFolder]).then(() => done());
}

function build() {
  return gulp
    .src(path.join("src", config.entryFileName))
    .pipe(
      webpackStream({
        mode:
          process.env.NODE_ENV === "production" ? "production" : "development",
        output: {
          filename: `${exportFileName}.js`,
          libraryTarget: "umd",
          library: config.mainVarName
        },
        resolve: {
          alias: {
            Config: path.resolve(__dirname, "./src/config"),
            Plugins: path.resolve(__dirname, "./src/plugins"),
            Utils: path.resolve(__dirname, "./src/utils")
          }
        },
        // optimization: {
        //   splitChunks: {
        //     chunks: "all",
        //     minSize: 10000,
        //     // minChunks: 2,
        //     // maxAsyncRequests: 2,
        //     // maxInitialRequests: 2,
        //     cacheGroups: {
        //       mockjs: {
        //         minChunks: 1,
        //         test: /[\\/]node_modules[\\/]/,
        //         name: "mockjs",
        //         chunks: "all"
        //       }
        //     }
        //   }
        // },
        module: {
          rules: [
            // {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
            {
              test: /\.js$/,
              loader: "babel-loader",
              exclude: /node_modules/,
              query: {
                presets: ["es2015"],
                plugins: [
                  "transform-runtime",
                  "transform-async-to-generator",
                  "syntax-dynamic-import"
                ]
              }
            }
          ]
        },
        // externals: {
        //   lodash: {
        //     commonjs: 'lodash',
        //     commonjs2: 'lodash',
        //     amd: 'lodash',
        //     root: '_'
        //   }
        // },
        externals: [/^lodash\/.+$/, "axios", "vue"],
        devtool: "source-map"
      })
    )
    .pipe(gulp.dest(destinationFolder))
    .pipe($.filter(["**", "!**/*.js.map"]))
    .pipe($.rename(`${exportFileName}.min.js`))
    .pipe(
      $.sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe($.uglify())
    .pipe($.sourcemaps.write("./"))
    .pipe(gulp.dest(destinationFolder));
}

const watchFiles = ["src/**/*", "package.json", "**/.eslintrc"];

// Run the headless unit tests as you make changes.
function watch() {
  gulp.watch(watchFiles);
}

function watchBuild() {
  gulp.watch(watchFiles, build);
}

// Build two versions of the library
exports.build = gulp.series(cleanDist, build);

exports.watch = watch;

exports["watch-build"] = watchBuild;

exports.default = exports.build;
