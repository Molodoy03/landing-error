var gulp     = require('gulp'),
    sass     = require('gulp-sass'),
    rename   = require('gulp-rename'),
    concat   = require('gulp-concat'),
    uglify   = require('gulp-uglify'),
    del      = require('del'),
    imagemin = require('gulp-imagemin'),
    cache    = require('gulp-cache');

gulp.task('sass', function(){
    return gulp.src('app/sass/main.sass')
           .pipe(sass({outputStyle:'compressed'}))
           .pipe(rename({suffix: '.min'}))
           .pipe(gulp.dest('app/css'));
});

gulp.task('sourcejs', function(){
	return gulp.src(['app/js/source.js'])
           .pipe(concat('source.min.js'))
           .pipe(uglify())
           .pipe(gulp.dest('app/js'));
});

gulp.task('js', ['sourcejs'], function(){
	return gulp.src(['app/libs/bootstrap4/js/bootstrap.min.js', 'app/js/source.min.js'])
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('deletedist', function(){ 
    return del.sync('dist'); 
});

gulp.task('watch', ['deletedist', 'sass', 'js'], function(){
    gulp.watch(['app/sass/*.sass', 'app/sass/**/*.sass'], ['sass']);
    gulp.watch('app/js/source.js', ['js']);
});

gulp.task('imagemin', function(){
	return gulp.src('app/img/*.jpg')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('clearcache', function(){ 
    return cache.clearAll(); 
});

gulp.task('build', ['deletedist', 'sass', 'imagemin','js'], function(){
	var buildFiles = gulp.src(['app/index.html', 'app/.htaccess'])
        .pipe(gulp.dest('dist'));
    
	var buildCss = gulp.src(['app/css/main.min.css'])
        .pipe(gulp.dest('dist/css'));
    
	var buildJs = gulp.src(['app/js/main.min.js'])
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['watch']);