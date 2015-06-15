'use strict';

var gulp = require('gulp');

var testGlob = [ './test/**/*.js' ];
var srcGlob  = [ './*.js',
                 './lib/**/*.js' ]
               .concat(testGlob);

//------------------------------------------------------------
// js lint task
//------------------------------------------------------------
gulp.task('lint', function() {

    var eslint  = require('gulp-eslint');

    return gulp.src(srcGlob)
                .pipe(eslint())
                .pipe(eslint.format('stylish'))
                .pipe(eslint.failAfterError());
});


//------------------------------------------------------------
// style checker task
//------------------------------------------------------------
gulp.task('style', function() {

    var jscs    = require('gulp-jscs');

    return gulp.src(srcGlob)
                .pipe(jscs());
});


//------------------------------------------------------------
// Install git precommit hooks
//------------------------------------------------------------
gulp.task('hook', function() {
    var symlink = require('gulp-symlink');

    return gulp.src('./pre-push')
                .pipe(symlink('.git/hooks/pre-push', { force: true }));
});


//------------------------------------------------------------
// Run Mocha Tests
//------------------------------------------------------------
gulp.task('test', function(callback) {

    var spawn = require('child_process').spawn;
    var istanbul = spawn('./node_modules/.bin/istanbul',
                        ['cover', '_mocha'],
                        { stdio: 'inherit'});

    istanbul.on('exit', function(exitCode) {
        return callback(exitCode);
    });
});


//------------------------------------------------------------
// Run Coverage
//------------------------------------------------------------
gulp.task('report', function(callback) {

    var spawn = require('child_process').spawn;
    var catProc = spawn('cat', ['./coverage/lcov.info']);
    var coverallsProc = spawn('./node_modules/.bin/coveralls');

    catProc.stdout.pipe(coverallsProc.stdin);
    catProc.stderr.pipe(coverallsProc.stdin);
    coverallsProc.stdout.pipe(process.stdout);
    coverallsProc.stderr.pipe(process.stderr);

    coverallsProc.on('exit', function(exitCode) {
        return callback(exitCode);
    });
});


//------------------------------------------------------------
// Watch Test folder
//------------------------------------------------------------
gulp.task( 'watch-tests', function() {
    gulp.watch( 'test/**/*.js', [ 'mocha' ] );
});


gulp.task('default', ['lint', 'style', 'test']);
