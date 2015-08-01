var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('default', ['less'], function() {
});

gulp.task('less', function() {
    return gulp.src('./src/css/design.less')
        .pipe(less())
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch('./design.less', ['less']);
});