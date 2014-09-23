# grunt-vagrantup

> Manages starting up and shutting down your Vagrant boxes as part of your Grunt development and testing workflow.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-vagrantup --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-vagrantup');
```

## Notes
This task does not install or configure Vagrant for you, it merely aids in spinning up and shutting down your Vagrant boxes on demand.  For installation and configuration of Vagrant, see https://www.vagrantup.com.

## Tasks

`vagrantup` is intended for use in two different modes:
* **Synchronous mode**, where the Vagrant box remains up only to support other Grunt tasks and is shut down once those tasks have completed.
* **Keepalive mode**, where the Vagrant box remains up indefinitely until the task process is cancelled.

### Synchronous mode
This is the default mode for `vagrantup`.  It is designed to support a workflow where a Vagrant box needs to be set up for automated testing and then disposed of.  


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
