"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                files: {
                    "dist/datetimepicker.ts.js": [
                        "src/js/datetime.ts", 
                        "src/js/state.ts", 
                        "src/js/template.ts", 
                        "src/js/uiBindings.ts", 
                        "src/js/eventBindings.ts", 
                        "src/js/plugin.ts"
                    ]
                },
                options: {
                    sourceMap: false,
                    noResolve: true,
                    newLine: "LF",
                    fast: "never",
                    target: "es5"
                }
            }
        },

        wrap: {
            jqueryplugin: {
                src: ['dist/datetimepicker.ts.js'],
                dest: 'dist/datetimepicker.plugin.js',
                options: {
                    wrapper: [";(function ($) {\n'use strict';", "\n}(jQuery));"]
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
    grunt.loadNpmTasks("grunt-wrap");
//    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["ts", "wrap:jqueryplugin", "jsbeautifier", "less:development", "clean"]);

}
