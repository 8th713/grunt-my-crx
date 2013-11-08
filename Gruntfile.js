module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    clean: {
      test: ['tmp']
    },

    manifest: grunt.file.readJSON('sample/manifest.json'),
    crx: {
      test: {
        files: {
          'tmp/sample.crx':                  'sample/',
          'tmp/<%= manifest.version %>.crx': 'sample/'
        },
        options: {
          pem: 'sample.pem'
        }
      }
    },
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'crx']);
};
