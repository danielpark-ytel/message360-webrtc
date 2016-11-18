module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            startBuild: "./tmp",
            finishBuild: "./tmp"
        },
        copy: {
            mainFiles: {
                files: [{
                    cwd: 'bower_components/font-awesome/fonts',
                    src: '**/*',
                    dest: './dist/fonts',
                    expand: true
                }]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {

                }
            }
        },
        cssmin: {

        },
        concat: {

        },
        
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-ng-annotate");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', [
        'copy',
        'clean:startBuild',
        'ngAnnotate',
        'cssmin',
        'ngtemplates',
        'concat',
        'uglify',
        'clean:finishBuild'
    ]);
}