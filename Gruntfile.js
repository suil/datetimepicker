"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default: {
                src: ["src/*.ts", "!node_modules/**/*.ts"],
                out: "dist/datetimepicker.plugin.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);

}
