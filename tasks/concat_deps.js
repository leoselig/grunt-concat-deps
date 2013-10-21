/*
 * grunt-concat-deps
 * https://github.com/leoselig/grunt-concat-deps
 *
 * Copyright (c) 2013 Leo Selig
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var yuidoc = require('yuidocjs');
	var _ = require('underscore');

	/**
	 * @method parseModules
	 * @param filename {string}
	 * @param code {string}
	 * @returns {{modules: string[], requires: string[]}[]}
	 * @private
	 */
	var parseModules = function(filename, code) {
		var parser = new (yuidoc.DocParser)({
			syntaxtype: 'js'
		});

		var options = {};
		options[filename] = code;
		parser.parse(options);

		var modules = [];
		var requires = [];
		for(var i in parser.data.modules) {
			var module = parser.data.modules[i];
			modules.push(module.name);
			Array.prototype.push.apply(requires, module.requires);
		}
		requires = _.uniq(requires);
		return {
			modules:  modules,
			requires: requires,
			code:     code
		}
	}

	/**
	 * @method resolveGraph
	 * @param list {{modules: string[], requires: string[]}[]}
	 * @param resolved {string[]}
	 * @param seen {string[]}
	 * @return {string[]}
	 * @private
	 */
	var resolveGraph = function(list, resolved, seen) {
		if(list.length === 0) {
			return list;
		}
		resolved = resolved || [];
		seen = seen || [];

		// Gets the file object info for one of its modules name
		var fileByModules = function(name) {
			var match = null;
			list.forEach(function(file) {
				if(_.indexOf(file.modules, name) >= 0) {
					match = file;
					return false;
				}
			});
			return match;
		}

		// Resolves a module and its dependencies
		var resolve = function(module) {
			var file = fileByModules(module);
			Array.prototype.push.apply(seen, file.modules);
			file.requires.forEach(function(module) {
				// Ignore resoled modules and dependencies in own file
				if((_.indexOf(resolved, module) < 0) &&
				   (_.indexOf(file.modules, module) < 0)) {
					// Catch circular dependencies
					if(_.indexOf(seen, module) < 0) {
						resolve(module);
					}
					else {
						grunt.fail.fatal('Circular dependency detected:\n\t' +
						                 file.modules.join(', ') + ' depend on ' +
						                 module, 1);
					}
				}
			});
			Array.prototype.push.apply(resolved, file.modules);
		}

		// Resolve all modules explicitly to include those that are not reached transitively
		list.forEach(function(file, i) {
			resolve(file.modules[0]);
		});

		// Sort input list according to the resolved order
		return list.sort(function(a, b) {
			return _.indexOf(resolved, a.modules[0]) - _.indexOf(resolved, b.modules[0]);
		});
	}

	grunt.registerMultiTask('concat_deps', 'Grunt plugin for concatenating files according to their declarative module definitions.', function() {
		var options = this.options({
			joinString: '\n'
		});
		this.files.forEach(function(f) {
			grunt.log.writeln('Parsing modules');
			var modules = [];
			f.src.forEach(function(srcFile) {
				// Do not parse intro and outro files
				if(srcFile === options.intro) {
					grunt.verbose.writeln(srcFile + ' is intro file: Skipped');
					return;
				}
				if(srcFile === options.outro) {
					grunt.verbose.writeln(srcFile + ' is outro file: Skipped');
					return;
				}
				grunt.verbose.writeln('Parsing ' + srcFile);
				modules.push(parseModules(srcFile, grunt.file.read(srcFile)));
			});
			grunt.verbose.writeln('Resolving dependencies for ' + modules.length +
			                      ' files');
			var resolved = resolveGraph(modules);
			var code = resolved.map(function(file) {
				return file.code;
			});
			if(options.intro) {
				code.unshift(grunt.file.read(options.intro))
			}
			if(options.outro) {
				code.push(grunt.file.read(options.outro))
			}
			grunt.log.writeln('Write output file to ' + options.out);
			grunt.file.write(options.out, code.join(options.joinString));
		});
	});

};
