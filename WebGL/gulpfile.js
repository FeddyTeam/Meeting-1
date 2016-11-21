var gulp = require('gulp');
var browserSync = require('browser-sync'); //浏览器刷新
var less = require('gulp-less'); //编译less
var useref = require('gulp-useref'); //合并js
var uglify = require('gulp-uglify'); //压缩js
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css'); //压缩css
var htmlmin = require('gulp-htmlmin'); //压缩html
var imagemin = require('gulp-imagemin'); //压缩图片
var cache = require('gulp-cache'); //
var del = require('del'); //清理生成文件
var runSequence = require('run-sequence'); //设置运行顺序
var autoprefixer = require('gulp-autoprefixer'); //自动补全css前缀
var sourcemaps = require('gulp-sourcemaps'); //编译less时生成地图



//清理生成文件
gulp.task('clean', function() {
	del('dist');
});

//清理除了images文件夹下的文件
gulp.task('clean:dist', function() {
	del(['dist/**/*', '!dist/images', '!dist/images/**/*'])
});

//压缩图片
gulp.task('images', function() {
	gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		// .pipe(cache(imagemin({
		// 	interlaced: true
		// })))
		.pipe(gulp.dest('dist/images'))
});

//压缩HTML
gulp.task('html', function() {
	var options = {
		collapseWhitespace: true,
		collapseBooleanAttributes: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	};
	gulp.src('dist/**/*.html')
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist'));
});
// 编译less
gulp.task('less', function() {
    gulp.src('less/style.less')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(less())
        .pipe(cssmin())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// 浏览器自动监听刷新
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: "dist/" //默认根目录
		},
		browser: "google chrome" //使用chrome打开
	})
});

//压缩js
gulp.task('uglify', function() {
	gulp.src('dist/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'))
		// content
});

//压缩css
gulp.task('minifyCSS', function() {
	gulp.src('dist/css/**/*.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/css/'))
});

// 合并js
gulp.task('useref', function() {
	gulp.src('app/**/*.html')
		// .pipe(uglify()) //压缩js
		.pipe(useref()) //合并js、css
		.pipe(gulp.dest('dist'))

	// .pipe(uglify())
	// .pipe(minifyCSS())
});


// gulp.task('useref', function() {
// 	gulp.src('src/*.html')
// 		// 压缩css
// 		.pipe(gulpIf('**/*.css', minifyCSS()))
// 		// 压缩js
// 		.pipe(gulpf('**/*.js', uglify()))
// 		.pipe(useref())
// 		.pipe(gulp.dest('dist'))
// });

//设置运行顺序
gulp.task('task-name', function() {
	runSequence('less', 'images', 'useref', 'browserSync');
});

gulp.task('watch', ['task-name'], function() {
	gulp.watch('app/**/*.html', ['useref']); //监听html
	gulp.watch('app/less/**/*.less', ['less']); //监听less并编译
	gulp.watch('app/css/**/*.css', ['useref']); //监听css
	gulp.watch('app/js/**/*.js', ['useref']); //监听js
	gulp.watch('app/images/**/*.+(png|jpg|gif|svg)', ['images']); //监听图片
	// gulp.watch('dist/css/**/*.css', ['minifyCSS']); //监听dist中css改变,压缩
	// gulp.watch('dist/js/**/*.js', ['uglify']); //监听dist中js，压缩
	// gulp.watch('dist/**/*.html', ['html']); //监听html,压缩
	gulp.watch('dist/images/**/*.+(png|jpg|gif|svg)', browserSync.reload); //监听dist中图片，刷新浏览器
	gulp.watch('dist/css/**/*.css', browserSync.reload); //监听dist中css改变,压缩，并刷新浏览器
	gulp.watch('dist/js/**/*.js', browserSync.reload); //监听distjs，压缩，并刷新浏览器
	gulp.watch('dist/**/*.html', browserSync.reload); //监听dist中html，并刷新浏览器
	// Other watchers
});


//压缩
gulp.task('min', function() {
	gulp.start('html', 'uglify', 'minifyCSS', 'images');
});
