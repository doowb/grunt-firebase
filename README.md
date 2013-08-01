# grunt-firebase

> Update your firebase data from a Grunt task!

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-firebase --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-firebase');
```

## The "firebase" task

### Overview
In your project's Gruntfile, add a section named `firebase` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  firebase: {
      options: {
        //
        // reference to start with (full firebase url)
        //
        reference: 'https://myfirebase.firebaseio.com/demo',

        //
        // token is the secret key used for connecting to firebase from the server
        // this is redacted from the public repo... add a file called ./config/auth.json
        // with your token in it... { "token": "my token here" }
        //
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
      }
  },
})
```

### Options

#### options.reference
Type: `string`
Require: true

reference to start with (full firebase url)

#### options.token
Type: `String`
Require: true

token is the secret key used for connecting to firebase from the server
this is redacted from the public repo... add a file called ./config/auth.json
with your token in it... { "token": "my token here" }

#### options.data
Type: `String | Object | Array`

This is the data that will be loaded into firebase at the specified reference point.

### Usage Examples

```js
var authConfig = grunt.file.readJSON('./config/auth.json');

grunt.initConfig({
  
  authConfig: authConfig,

  firebase: {
      options: {
        //
        // reference to start with (full firebase url)
        //
        reference: 'https://myfirebase.firebaseio.com/demo',

        //
        // token is the secret key used for connecting to firebase from the server
        // this is redacted from the public repo... add a file called ./config/auth.json
        // with your token in it... { "token": "my token here" }
        //
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
      }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
