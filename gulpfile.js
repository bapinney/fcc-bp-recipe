var gulp = require('gulp'),  //Requires the Gulp Node package
    sass = require('gulp-sass'), // (based on node-sass)
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber');

var babelInputFile = 'script.jsx',
    cssOutputFile = 'styles.css',
    jsOutputFile = 'script.js',
    sassInputFile = 'styles.scss';

//Task name goes in .task's 1st argument.  If it is 'default', that is the task that runs when just 'gulp' is entered
gulp.task('default', ['compileSass', 'compileBabel', 'watch'], function() {
    console.log("Inside default task");
});

//Could take a min...
gulp.task('compileBabel', function() {
    console.log("Inside compileBabel task");
    return gulp.src(babelInputFile)
        //.pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['es2015', 'react'] //As per https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html -- Uses babel-preset-es2015 (See https://github.com/babel/gulp-babel#install -- This plugin also MUST be registered in .babelrc.  See http://techblog.constantcontact.com/software-development/use-es2015-with-babel-and-gulp/)
            }))
        //.pipe(plumber.stop())
            .pipe(sourcemaps.write())  //No arguments mean write the sourcemaps inline
            .pipe(gulp.dest('./'));
});

gulp.task('compileSass', function() {
    console.log("Inside compileSass task");
    
    return gulp.src(sassInputFile)
        .pipe(plumber())
            .pipe(sourcemaps.init()) //Need to do this before calling write()
            .pipe(sass({
                sourceComments: 'map',
                sourceMap: 'sass',
                outputStyle: 'nested'
            }).on('error', sass.logError))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./'))
        .pipe(livereload());
});

gulp.task('watchBabel', function() {
    gulp.watch(babelInputFile, ['compileBabel']);
})

gulp.task('watchSass', function() {
    console.log("Watching .scss for changes...");
    
    gulp.watch(sassInputFile, ['compileSass'])
    .on('change', function(event) {
        var file = event.path.split('/');
        file = file[file.length - 1];
        console.log(`File ${file} was ${event.type}, running tasks...`);
    })
});

gulp.task('compileWatchBabel', ['compileBabel', 'watchBabel'], function() {

});

gulp.task('watch', function() {
    
    var server = livereload.listen();
    
    gulp.watch(sassInputFile, ['compileSass'])
    .on('change', function(event) {
        var file = event.path.split('/');
        file = file[file.length - 1];
        console.log(`File ${file} was ${event.type}, running tasks...`);
    });
    
    gulp.watch(babelInputFile, ['compileBabel'])
    .on('change', function(event) {
        var file = event.path.split('/');
        file = file[file.length - 1];
        console.log(`File ${file} was ${event.type}, running tasks...`);
    });
})