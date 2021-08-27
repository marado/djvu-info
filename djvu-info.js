/* djvu-info.js, GPLv3, https://github.com/marado/djvu-info */

if (process.argv.length < 3) {
	console.log("we need a file as an argument.");
	process.exit();
}

var fs = require('fs');
var file = fs.readFileSync(process.argv[2]);

console.log("Read file, with length " + file.length);

if (file.length < 4) { // TODO: raise the limit to what makes sense
	console.log("this file is too small to be a valid djvu file.");
	process.exit();
}

var header = file.toString("utf-8", 0, 4);
if (header === "AT&T") {
	console.log("This is a standard DJVU file");
} else if (header === "SDJV") {
	console.log("This is a 'secure' DJVU file (ie, with DRM)");
} else {
	console.log("This is not a DJVU file!");
	process.exit();
}
