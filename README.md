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
        reference: 'https://grunt-firebase.firebaseio.com/demo',

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
  }
});
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

#### options.mode
Type: `String`
Required: false
Default: `upload`

Specify if you want to upload or download your data from firebase.

##### Modes
  - `upload`: files in the `files` property will be uploaded to the reference location
  - `download`: add a `dest` to your options to determine where the data file will go.
  - `live`: files in the `files` property will be watched and uploaded to firebase when changed or downloaded from firebase when changed remotely.

#### options.dest
Type: `String`
Required: false
Default: `./`

Used when `mode: download` is set in the options. This is the base path for
which the downloaded file will go.

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
      reference: 'https://grunt-firebase.firebaseio.com/demo',

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
  }
});
```

You don't want to put your data in the Gruntfile?!?! Why not?

Okay... just put it in some `.json` files and tell the task where to find them. We'll handle importing the data and uploading it to firebase for you:

```js
var authConfig = grunt.file.readJSON('./config/auth.json');

grunt.initConfig({
  
  authConfig: authConfig,

  firebase: {
    options: {
      //
      // reference to start with (full firebase url)
      //
      reference: 'https://grunt-firebase.firebaseio.com/demo',

      //
      // token is the secret key used for connecting to firebase from the server
      // this is redacted from the public repo... add a file called ./config/auth.json
      // with your token in it... { "token": "my token here" }
      //
      token: '<%= authConfig.token %>'
    },
    load: {
      files: [
        { src: './path/to/my/data/**/*.json' }
      ]
    }
  }
});
```

Now that your file is uploaded, make some changes to it through the [Firebase Forge](https://www.firebase.com/)
and download the updates to your file:

```js
var authConfig = grunt.file.readJSON('./config/auth.json');

grunt.initConfig({
  
  authConfig: authConfig,

  firebase: {
    options: {
      //
      // reference to start with (full firebase url)
      // when downloading, the final segment in the path
      // will determine the filename where your data goes
      //
      reference: 'https://grunt-firebase.firebaseio.com/demo',

      //
      // token is the secret key used for connecting to firebase from the server
      // this is redacted from the public repo... add a file called ./config/auth.json
      // with your token in it... { "token": "my token here" }
      //
      token: '<%= authConfig.token %>'
    },
    getMyFiles: {
      options: {
        mode: 'download',
        dest: 'path/to/downloaded/files/'
      }
    }
  }
});
```
This will result in all of your data located at `https://grunt-firebase.firebaseio.com/demo`
to be downloaded and stored in a file located at `path/to/downloaded/files/demo.json`


By now you might be thinking... "This is all great, but I want to really use Firebase features and collaborate in realtime."

You can!!! Almost... it all depends on your text editor, but there's now a `live mode`!
Just set the option `mode: live` and tell `grunt-firebase` which files to watch.
Each file in the glob pattern will be uploaded to the reference path when changed locally,
and the local file will be updated when changed remotely.

```js
var authConfig = grunt.file.readJSON('./config/auth.json');

grunt.initConfig({
  
  authConfig: authConfig,

  firebase: {
    options: {
      //
      // reference to start with (full firebase url)
      // this is the root path that will be watched for changes
      // and each "key" will be it's own file
      //
      reference: 'https://grunt-firebase.firebaseio.com/demo',

      //
      // token is the secret key used for connecting to firebase from the server
      // this is redacted from the public repo... add a file called ./config/auth.json
      // with your token in it... { "token": "my token here" }
      //
      token: '<%= authConfig.token %>'
    },
    getMyFiles: {
      options: {
        mode: 'live'
      },
      files: [
        { src: './path/to/my/data/**/*.json' }
      ]
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
