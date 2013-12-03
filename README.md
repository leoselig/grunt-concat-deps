# grunt-concat-deps

> Grunt plugin for concatenating files according to their declarative module definitions.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-concat-deps --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-concat-deps');
```

## Module definition

The declarative module definition relies on the YuiDoc synax (http://yui.github.io/yuidoc/syntax/) that makes use of the annotations `@module` and `@requires`.
It is possible to declare multiple modules in one file. Please note that in this case, dependencies inside of one single file are ignored.
Find below an example of two files.
#####Module_A.js
```js
/**
 * @module A1
 * @requires B
 */
var A1 = function() {

}

/**
 * @module A2
 * @requires A1
 */
var A2 = function() {

}
```
#####Module_B.js
```js
/**
 * @module B
 */
var B = function() {

}
```

## The "concat_deps" task

### Overview
In your project's Gruntfile, add a section named `concat_deps` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  concat_deps: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Taget configuration

#### [target].options.intro
Type: `String`
Default value: `null`

The file to be used as an intro (e.g. license information or beginning of self invoking function).

#### [target].options.outro
Type: `String`
Default value: `null`

The file to be used as an outro (e.g. end of self invoking function).

#### [target].options.out
Type: `String`
Default value: `null`

The file into which the output should be written.

#### [target].options.joinString
Type: `String`
Default value: `\n`

The 'glue string' to be used when concatenating the files.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  main: {
	options: {
		out:   'out/out.js'
	},
	files:   {
		src:  'src/**/*.js'
	}
})
```

#### Custom Options

```js
grunt.initConfig({
  main: {
    options: {
		intro: 'src/intro.js',
		outro: 'src/outro.js',
		out:   'out/out.js',
        joinString: '\n'
	},
	files:   {
		src:  'src/**/*.js'
	}
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
```0.2.0``` Allowed concatenation of undeclared modules
```0.1.0``` Core functionality implemented
