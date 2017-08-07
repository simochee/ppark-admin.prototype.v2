const gulp = require('gulp');
// for BrowserSync
const browserSync = require('browser-sync');
// for Webpack
const webpack = require('gulp-webpack');
const _webpack = require('webpack');
// for Stylus
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
// for Pug
const pug = require('gulp-pug');

gulp.task('browsersync', () => {
    browserSync.init(null, {
        server: {
            baseDir: './docs'
        },
        port: 43002,
        open: 'external',
        notify: false,
    });
});

gulp.task('pug', () => {
    gulp.src('./src/pug/**/!(_)*.pug', { base: './src/pug' })
        .pipe(pug())
        .pipe(gulp.dest('./docs'));
});

gulp.task('webpack', () => {
    gulp.src('')
        .pipe(webpack({
            entry: {
                bundle: './src/scripts/entry.js'
            },
            output: {
                path: `${__dirname}/public/js`,
                filename: '[name].js'
            },
            module: {
                loaders: [
                    {
                        test: /\.js$|\.tag$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015'],
                            cacheDirectory: true
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['', '.js']
            },
            plugins: [
                new _webpack.optimize.UglifyJsPlugin()
            ],
            devtool: 'inline-source-map',
            watch: true
        }))
        .pipe(gulp.dest('./docs/js'));
});

gulp.task('sass', () => {
    gulp.src('./src/sass/!(_)*.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ cssnext({ browsers: ['last 1 version'] }) ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/css'));
});

gulp.task('dev', ['browsersync', 'webpack', 'sass'], () => {
    watch(['./src/sass/**/*.sass'], () => {
        gulp.start('sass');
    });
    watch(['./src/pug/**/*.pug'], () => {
        gulp.start('pug');
    });
    watch(['./docs/**/*'], () => {
        browserSync.reload();
    });
});
