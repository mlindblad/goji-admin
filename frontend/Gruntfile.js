"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                files: {
                    "app/css/main.css": "app/less/main.less"
                }
            }
        },
        connect: {
            options: {
                livereload: 35729,
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            devserver: {
                options: {
                    base: ['app']
                }
            }
        },
        watch: {
            devserver: {
                options: {
                    livereload: true
                },
                files: ['app/**/*.html', 'app/**/*.js', 'app/less/*.less', '!app/components/**/*', '!app/config.js'],
                tasks: ['less:development']
            }
        },
        ngconstant: {
            development: [{
                dest: 'app/config.js',
                name: 'config',
                constants: {
                    config: {
                        env: 'development',
                        version: grunt.file.readJSON('package.json').version,
                    }
                }
            }],

            production: [{
                dest: 'app/config.js',
                name: 'config',
                constants: {
                    config: {
                        env: 'production',
                        version: grunt.file.readJSON('package.json').version
                    }
                }
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-constant');

    grunt.registerTask('server', ['ngconstant:development', 'connect:devserver', 'watch:devserver']);

}