/* djvu-info.js, GPLv3, https://github.com/marado/djvu-info */

if (process.argv.length < 3) {
	console.log("we need a file as an argument.");
	process.exit();
}

var fs = require('fs');
var file = fs.readFileSync(process.argv[2]);

console.log("Read file, with length " + file.length);

if (file.length < 16) { // TODO: raise the limit to what makes sense
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

function readChunk(start) {
	var chunkID = file.toString("utf-8", start, start+4);
	if (chunkID !== "FORM") {
		console.log("FORM expected but not seen. Corrupted file?");
		process.exit();
	}

	var chunksize = file.slice(start+4, start+8).readInt32BE(0);
	console.log("FORM of size " + chunksize + " found.");

	function readDIRM(dstart) {
		console.log("A DIRM is expected at " + dstart + "!");
		// Sometimes instead of a DIRM we find another chunk...
		if (file.toString("utf-8", dstart, dstart+4) === "FORM") {
			console.log("Found another page");
			var dirm = readChunk(dstart);
			if (dirm !== "DJVU" && dirm !== "DJVI") {
				console.log("I think this chunk isn't really a valid DIRM... (" + dirm + ")");
				process.exit();
			}
		} else if (file.toString("utf-8", dstart, dstart+4) !== "DIRM") {
			console.log("FORM or DIRM expected, found none! Corrupt file?");
			process.exit();
		} else {
			console.log("DIRM found:");
			// read directory:
			// directory's encoded data, consisting of
			// 1 byte - flags
			//          The MSB indicates if this is bundled (1 bundled, 0 not bundled), the rest indicates the version (for a DjVu v3 file it should be 1).
			var flags = file[dstart+4];
			var bundled = (flags >= 128);
			if (bundled) {
				console.log("bundled multipage");
			} else {
				console.log("indirect multipage");
			}

			var version = (flags % 128);
			console.log("version is " + version);

			// INT16 - number of files
			var nfiles = file.slice(dstart+5, dstart+7).readInt16BE(0);
			console.log("DIRM refers to " + nfiles + " files.");

			// INT32 - offsets
			var offsets = file.slice(dstart+7, dstart+11);
			if (bundled) { // offsets are only used when bundling
				console.log("file offsets: " + offsets[0] + ", " + offsets[1] + " and " + offsets[2] + ".");
			}

			// directory's encoded data (BZZ)
			// INT24 - sizes
			// 1 byte - flags for files
			// 1 to 3 ZSTR per file
			console.log("NOT IMPLEMENTED YET|"); process.exit();
		}
	}

	var formtype = file.toString("utf-8", start+8, start+12);

	switch (formtype) {
		case "DJVU":
			console.log("FORM:DJVU: single page document");
			// INFO coming up
			console.log("reading the rest of the file is not implemented yet.");
			break;
		case "DJVM":
			console.log("FORM:DJVM: multipage document");
			// DIRM coming up
			readDIRM(start+12);
			break;
		case "DJVI":
			console.log("FORM:DJVI: shared annotations");
			// dictionary coming up
			console.log("reading the rest of the file is not implemented yet.");
			break;
		case "THUM":
			console.log("FORM:THUM: embedded thumbnails");
			// thumb coming up
			console.log("reading the rest of the file is not implemented yet.");
			break;
		default:
			console.log("FORM:" + formtype + ": this type is not recognized!");
			process.exit();
	}

	return formtype;
}

readChunk(4);
