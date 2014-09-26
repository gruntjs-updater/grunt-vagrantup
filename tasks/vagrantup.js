/*
 * grunt-vagrantup
 * https://github.com/sfishel18/grunt-vagrantup
 *
 * Copyright (c) 2014 Simon Fishel
 * Licensed under the MIT license.
 */

'use strict';

var shutdownManager = require('node-shutdown-manager'),
    q = require('q'),
    padStdio = require('pad-stdio');

module.exports = function(grunt) {

    var performSetup = function(tasks, callback) {
        callback = callback || function() {};
        var vagrantCallback = (tasks && tasks.length > 0) ?
                function() {
                    grunt.log.writeln().writeln('Running Vagrant setup tasks...').writeln();
                    padStdio.stdout('    ');
                    grunt.util.spawn(
                        {
                            grunt: true,
                            args: tasks
                        },
                        function(err, result, code) {
                            if (err || code > 0) {
                                grunt.error(result.stderr || result.stdout);
                                return;
                            }
                            grunt.log.writeln('\n' + result.stdout);
                            padStdio.stdout();
                            callback();
                        }
                    )
                } :
                callback;

        vagrantUp(vagrantCallback);
    };

    var vagrantUp = function(callback) {
        callback = callback || function() {};
        grunt.util.spawn(
            {
                cmd: 'vagrant',
                args: ['up'],
                opts: { stdio: 'inherit' }
            },
            callback
        );
    };

    var performTeardown = function(tasks, callback) {
        if(tasks && tasks.length > 0) {
            grunt.log.writeln().writeln('Running Vagrant teardown tasks...').writeln();
            padStdio.stdout('    ');
            grunt.util.spawn(
                {
                    grunt: true,
                    args: tasks
                },
                function(err, result, code) {
                    if (err || code > 0) {
                        grunt.error(result.stderr || result.stdout);
                        return;
                    }
                    grunt.log.writeln('\n' + result.stdout);
                    padStdio.stdout();
                    grunt.log.writeln();
                    vagrantHalt(callback);
                }
            );
        }
        else {
            vagrantHalt(callback);
        }
    };

    var vagrantHalt = function(callback) {
        callback = callback || function() {};
        grunt.util.spawn(
            {
                cmd: 'vagrant',
                args: ['halt'],
                opts: { stdio: 'inherit' }
            },
            callback
        );
    };

    var setupExitHandlers = function(teardownTasks, callback) {
        var manager = shutdownManager.createShutdownManager({
            timeout: 10000
        });
        manager.addShutdownAction(function() {
            var dfd = q.defer();
            performTeardown(teardownTasks, function() {
                if(callback) {
                    callback();
                }
                dfd.resolve();
            });
            return dfd.promise;
        });
    };

    grunt.registerMultiTask('vagrantup', '', function() {
        var done = this.async();
        var options = this.options({
            keepalive: false,
            teardown: [],
            setup: []
        });
        var keepAlive = options.keepalive || this.flags.keepalive;
        if(keepAlive) {
            process.stdin.resume();
            performSetup(options.setup, function() {
                grunt.log.writeln().writeln('Setup complete. Waiting...').writeln();
            });
            setupExitHandlers(options.teardown, done);
        }
        else {
            performSetup(options.setup, done);
            grunt.config.merge({
                vagranthalt: {
                    options: {
                        performTeardown: performTeardown.bind(null, options.teardown)
                    }
                }
            });
        }
    });

    grunt.registerTask('vagranthalt', '', function() {
        var done = this.async();
        this.options().performTeardown(done);
    });

};
