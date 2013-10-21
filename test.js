var yuidoc = require('yuidocjs');
var fs = require('fs');

var objLog = function(obj, val) {
	console.log(Object.keys(obj).join('\n'));
}

var parser = new (yuidoc.DocParser)({
	syntaxtype: 'js'
});

var result = parser.parse({
	'demo.js': fs.readFileSync('demo.js').toString()
});

console.log(parser.data.modules.a.requires[0]);