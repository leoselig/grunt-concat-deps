/*
 * grunt-concat-deps
 * https://github.com/leoselig/grunt-concat-deps
 *
 * Copyright (c) 2013 Leo Selig
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint:      {
			all:     [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean:       {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		concat_deps: {
			demo: {
				options: {
					intro: 'demo/src/intro.js',
					outro: 'demo/src/outro.js',
					out:   'demo/out/out.js'
				},
				files:   {
					src:  'demo/src/**/*.js'
				}
			}
		},

		// Unit tests.
		nodeunit:    {
			tests: ['test/*_test.js']
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'concat_deps', 'nodeunit']);

	// By default, lint and run all tests.


	grunt.registerTask('demo', ['concat_deps:demo']);

};
