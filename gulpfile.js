//任务：compileSass:sass->css:
var gulp = require("gulp"); 
var sass = require("gulp-sass"); 

gulp.task("compileSass",function(){
	return gulp.src("./public/sass/**/*.scss")
	.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError)) 
	.pipe(gulp.dest("./public/css/"))
})
// 任务：监听.scss
gulp.task("listen",function(){
gulp.watch("./public/sass/**/*.scss",gulp.series("compileSass"))
})