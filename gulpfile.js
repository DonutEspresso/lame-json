'use strict';

var gulp = require('gulp');

//------------------------------------------------------------
// js lint task
//------------------------------------------------------------
gulp.task('lint', function() {

    var eslint  = require('gulp-eslint');
    var srcGlob = [ './lib/**/*.js', './*.js' ];

    return  gulp.src(srcGlob)
                .pipe(eslint())
                .pipe(eslint.format('stylish'))
                .pipe(eslint.failAfterError());
});


//------------------------------------------------------------
// Install git precommit hooks
//------------------------------------------------------------
gulp.task('hook', function() {
    var symlink = require('gulp-symlink');

    return  gulp.src('./pre-push')
                .pipe(symlink('.git/hooks/'));
});

//------------------------------------------------------------
// Run Mocha Tests
//------------------------------------------------------------
gulp.task('mocha', function(){
    var mocha = require( 'gulp-mocha' );

    return  gulp.src( 'test/**/*.js' )
                .pipe( mocha({report: 'spec'}));
});

//------------------------------------------------------------
// Watch Test folder
//------------------------------------------------------------
gulp.task( 'watch-tests', function(){
    gulp.watch( 'test/**/*.js', [ 'mocha' ] );
});


gulp.task('default', ['lint', 'mocha']);