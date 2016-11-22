module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            //Clean both build and dist files for new build.
            start_build: [
                './build',
                './dist',
            ],
            //Clean the build and tmp files after the build has completed.
            end_build: [
                './build',
                './tmp'
            ]
        },
        copy: {
            //Copy font awesome fonts into distribution folder.
            dist_fonts: {
                files: [{
                    cwd: 'bower_components/font-awesome/fonts',
                    src: '**/*',
                    dest: './dist/fonts/',
                    expand: true
                }]
            },
            dist_css: {
                files: [{
                    cwd: './public/css',
                    src: '*.min.css',
                    dest: './build/css/',
                    expand: true
                }]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app_main: {
                files: {
                    './build/js/app.minsafe.js': [
                        './public/js/verto.module.js'
                    ],
                    './build/js/app-controllers.minsafe.js': [
                        './public/js/controllers/*.module.js',
                        './public/js/controllers/*Controller.js'
                    ],
                    './build/js/app-services.minsafe.js': [
                        './public/js/storage-service/*.module.js',
                        './public/js/storage-service/*Service.js',
                        './public/js/verto-service/*.module.js',
                        './public/js/verto-service/*Service.js',
                    ]
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    './build/css/animate.min.css': [
                        './public/css/animate.css'
                    ],
                    './build/css/dashboard.min.css': [
                        './public/css/dashboard.css'
                    ],
                    './build/css/spinners.min.css': [
                        './public/css/spinners.css'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: ';' + grunt.util.linefeed
            },
            css_main: {
                src: [
                    './build/css/bootstrap.min.css',
                    './build/css/animate.min.css',
                    './build/css/dashboard.min.css',
                    './build/css/spinners.min.css',
                    './bower_components/font-awesome/css/font-awesome.min.css',
                    './bower_components/ngToast/dist/ngToast.min.css',
                    './bower_components/ngToast-animations.min.css',
                ],
                dest: './dist/css/<%= pkg.name %>.css'
            },
            js_main: {
                src: [
                    './build/js/app.minsafe.js',
                    './build/js/app-controllers.minsafe.js',
                    './build/js/app-services.minsafe.js'
                ],
                dest: './build/js/<%= pkg.name %>.js'
            },
            libs_main: {
                src: [
                    './bower_components/jquery/dist/jquery.min.js',
                    './bower_components/angular/angular.min.js',
                    './bower_components/angular-animate/angular-animate.min.js',
                    './bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    './bower_components/ngstorage/ngStorage.min.js',
                    './bower_components/angular-cookies/angular-cookies.min.js',
                    './bower_components/moment/moment.js',
                    './bower_components/angular-moment/angular-moment.min.js',
                    './bower_components/angular-sanitize/angular-sanitize.min.js',
                    './bower_components/ngToast/dist/ngToast.min.js',
                    './bower_components/angular-translate/angular-translate.min.js',
                    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    './bower_components/humanize-duration/humanize-duration.js',
                    './bower_components/angular-timer/dist/angular-timer.min.js',
                    './bower_components/angular-prompt/dist/angular-prompt.min.js',
                    './bower_components/angular-audio/app/angular-audio.js'
                ],
                dest: './build/libs/<%= pkg.name %>-libs.js'
            },
            deps_main: {
                src: [
                    './public/js/verto-dependencies/jquery.jsonrpcclient.js',
                    './public/js/verto-dependencies/jquery.FSRTC.js',
                    './public/js/verto-dependencies/jquery.verto.js',
                    './bower_components/jquery-json/dist/jquery.json.min.js',
                    './public/js/verto-dependencies/getScreenId.js',
                    './public/js/verto-dependencies/md5.min.js',
                    './public/js/verto-dependencies/volume-meter.js'
                ],
                dest: './build/deps/<%= pkg.name %>-deps.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    // drop_console: true,
                    // properties: true,
                    // dead_code: true,
                    // conditionals: true,
                    // comparisons: true,
                    // booleans: true,
                    // loops: true,
                    // unused: true,
                },
                preserveComments: false,
                mangle: false
            },
            app: {
                src: [
                    './build/js/<%= pkg.name %>.js'
                ],
                dest: './dist/<%= pkg.name %>.min.js'
            },
            libs: {
                src: [
                    './build/libs/<%= pkg.name %>-libs.js'
                ],
                dest: './dist/<%= pkg.name %>-libs.min.js'
            },
            deps: {
                src: [
                    './build/deps/<%= pkg.name %>-deps.js'
                ],
                dest: './dist/<%= pkg.name %>-deps.min.js'
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-ng-annotate");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', [
        'clean:start_build',
        'copy',
        'cssmin',
        'ngAnnotate',
        'concat',
        'uglify',
        'clean:end_build'
    ]);
}