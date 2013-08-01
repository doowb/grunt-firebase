/*
 * grunt-firebase
 * https://github.com/assemble/grunt-firebase
 *
 * Copyright (c) 2013 Assemble
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('lodash');
  var Firebase = require('firebase');

  var validation = {
    reference: 'Define a firebase URL to upload data to.',
    token: 'Define a token used to authenticate against the firebase reference.'
  };

  var validateOptions = function(options, cb) {
    var errs = [];

    _.forOwn(validation, function(msg, k) {
      if(!options[k]) {
        errs.push({option: k, msg: msg});
      }
    });

    if(errs.length === 0) {
      cb(null, true);
    } else {
      cb(errs, false);
    }
  };

  grunt.registerMultiTask('firebase', 'Update your firebase.', function() {
    
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      data: {}
    });

    validateOptions(options, function(errs, valid) {
      if(errs) {
        errs.forEach(function(err) {
          grunt.warn('options.' + err.option + ' undefined: ' + err.msg);
        });
        done(false);
      }
    });

    // create a new firebase reference using the reference url
    var ref = new Firebase(options.reference);

    // authenticate to firebase with the token
    ref.auth(options.token, function(err, result) {
      if(err) {
        grunt.warn('Firebase login failed: ', err);
        done(false);
      }

      // update firebase with the data
      ref.update(options.data);

      done();

    });

  });

};
