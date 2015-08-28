"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                src: ["src/js/*.ts"],
                out: "dist/datetimepicker.ts.js",
                options: {
                    sourceMap: false,
                    noResolve: true,
                    newLine: "LF",
                    fast: "never",
                    target: "es5"
                },
            }
        },
        
        concat: {
            "jquery-wrapping": {
                src: ['dist/datetimepicker.ts.js'],
                dest: 'dist/datetimepicker.plugin.js',
                options: {
                    banner: ";(function($) { \n'use strict';\n;",
                    footer: "\n}(jQuery));",
                    separator: ""
                }
            }
        },
        
        // uglify: {
        //     datetimepicker: {
        //         options: {
        //             beautify: true,
        //             mangle: false,
        //             sourceMap: false,
        //             compress: false
        //         },
        //         files: {
        //             "dist/datetimepicker.plugin.js": ["dist/datetimepicker.js"]
        //         }
        //     }
        // }
        
        jsbeautifier : {
            files : ["dist/datetimepicker.plugin.js"],
            options : {}
        },
        
        less: {
            development: {
                options: {
                    paths: ["assets/css"],
                    compress: false,
                    cleancss: false
                },
                files: {
                    "dist/datetimepicker.css": "src/assets/css/datetimepicker.less"
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    compress: true,
                    cleancss: true
                },
                files: {
                    "dist/datetimepicker.min.css": "src/assets/css/datetimepicker.less"
                }
            }
        },
        
        clean: ["dist/datetimepicker.ts.js", ".tscache"]
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-concat");
//    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["ts", "concat:jquery-wrapping", "jsbeautifier", "less:development", "clean"]);

}
