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
  var path = require('path');
  var Firebase = require('firebase');
  var gaze = require('gaze');

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

  var upload = function(task, options, done) {
    // create a new firebase reference using the reference url
    var ref = new Firebase(options.reference);

    // authenticate to firebase with the token
    ref.auth(options.token, function(err, result) {
      if(err) {
        grunt.warn('Firebase login failed: ', err);
        done(false);
      }

      // update firebase with the data
      if(options.data) {
        ref.update(options.data);
      }

      // for each file, update the firebase using the filename as the key
      task.filesSrc.forEach(function(filepath) {
        if(grunt.file.exists(filepath)) {
          var filename = path.basename(filepath, path.extname(filepath));
          var data = grunt.file.readJSON(filepath);
          ref.child(filename).update(data);
        }
      });

      done();

    });

  };

  var download = function(task, options, done) {
    // create a new firebase reference using the reference url
    var ref = new Firebase(options.reference);

    var dest = options.dest || ('./');
    var filename = (options.reference.split('/')[options.reference.split('/').length -1 ]);
    var ext = path.extname(filename) || '.json';
    var output = path.join(dest, filename) + ext;

    // authenticate to firebase with the token
    ref.auth(options.token, function(err, result) {
      if(err) {
        grunt.warn('Firebase login failed: ', err);
        done(false);
      }

      // download to the destination
      grunt.log.writeln(('Downloading to ' + output).cyan);
      ref.on('value', function(snapshot) {
        var data = snapshot.exportVal();
        grunt.file.write(output, JSON.stringify(data, null, 2));
        done();
      });

    });

  };

  var live = function(task, options, done) {
    // create a new firebase reference using the reference url
    var ref = new Firebase(options.reference);

    var fileMapping = {};
    task.filesSrc.forEach(function(filepath) {
      var filename = path.basename(filepath, path.extname(filepath));
      fileMapping[filename] = filepath;
    });

    // authenticate to firebase with the token
    ref.auth(options.token, function(err, result) {
      if(err) {
        grunt.warn('Firebase login failed: ', err);
        done(false);
      }

      // for each file, setup live watching
      gaze(task.filesSrc, function(err, watcher) {
        if(err) {
          grunt.warn('Error attempting to watch file: ' + task.filesSrc, err);
          done(false);
        }

        grunt.log.writeln('Listening for file changes...'.cyan);

        this.on('changed', function(filepath) {
          grunt.log.writeln((filepath + ' was changed. Uploading to firebase...').cyan);
          var filename = path.basename(filepath, path.extname(filepath));
          var data = grunt.file.readJSON(filepath);
          ref.child(filename).update(data);
        });

        ref.on('child_changed', function(snapshot) {
          var name = snapshot.name();
          grunt.log.writeln((name + ' was changed. Updating file with new data...').cyan);
          var data = snapshot.exportVal();
          var filepath = fileMapping[name];
          if(grunt.file.exists(filepath)) {
            grunt.file.write(filepath, JSON.stringify(data, null, 2));
          }
        });

      });

    });

  };

  grunt.registerMultiTask('firebase', 'Update your firebase.', function() {

    var task = this;
    var done = task.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = task.options({
      mode: 'upload'
    });

    validateOptions(options, function(errs, valid) {
      if(errs) {
        errs.forEach(function(err) {
          grunt.warn('options.' + err.option + ' undefined: ' + err.msg);
        });
        done(false);
      }
    });

    var func = null;
    switch(options.mode.toLowerCase()) {
      case 'upload':
        func = upload;
        break;
      case 'download':
        func = download;
        break;
      case 'live':
        func = live;
        break;
      default:
        func = upload;
        break;
    }

    func(task, options, done);

  });

};
