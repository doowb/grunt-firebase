/*
 * grunt-firebase
 * https://github.com/assemble/grunt-firebase
 *
 * Copyright (c) 2013 Assemble
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var authConfig = grunt.file.readJSON('./config/auth.json');

  // Project configuration.
  grunt.initConfig({

    authConfig: authConfig,

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    firebase: {
      options: {
        // reference to start with (full firebase url)
        reference: 'https://grunt-firebase.firebaseio.com/test',
        // token is the secret key used for connecting to firebase from the server
        // this is redacted from the public repo... add a file called ./config/auth.json
        // with your token in it... { "token": "my token here" }
        token: '<%= authConfig.token %>'
      },
      load: {
        options: {
          data: {
            one: {
              foo: 'bar'
            },
            two: [
              { a: 'A' },
              { b: 'B' },
              { c: 'C' }
            ],
            three: [ 'first', 'second', 'third' ]
          }
        }
      },
      upload: {
        files: [{ src: './data/*.json' }]
      },
      download: {
        options: {
          mode: 'download',
          dest: './data/downloads/'
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'firebase']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
