// This script looks innto a DJVU file, and tries to find out if it has DRM and
// which kind. You might need to hack around to see it working on your use case.
// There aren't many examples o valid sdjvu files out there that I know of, but
// currently this has a 50% chance of reaching a seemingly useful conclusion.

const { Form, Chunk, extensions, ChunkIterator } = require('interchange-file-format');
const fs = require('fs');

if (process.argv.length < 3) {
	console.log("we need a file as an argument.");
	process.exit();
}

const file = fs.readFileSync(process.argv[2]);

var success = false;

function iterate(b,offset) {
  const iterator = ChunkIterator.from(b,offset)
  for (const chunk of iterator) {
    if (chunk.id == "AT&T") {
      return console.log("This isn't supposed to be a DRM-capable DjVu file.");
    }
    if (chunk.id == "SDJV") {
      console.log("'Secure' file announced:");
      return iterate(b,offset+4);
    } else if (chunk.id == "FORM") {
      return iterate(b,offset+8);
    } else if (chunk.id == "DJVM") {
      return iterate(b,offset+4);
    } else if (chunk.id == "DIRM") {
      // Directory, nothing to see here, let's go on
    } else if (chunk.id == "NAVM") {
      // Navigation bookmarks, nothing to see here, let's go on
    } else if (chunk.id == "DJVI") {
      console.log("Found one DJVI: going to inspect it:");
      return iterate(b,offset+4);
    } else if (chunk.id == "SINF") {
      console.log("Got a SINF: Secure Info. Within should be the DRM details...");
    } else if (chunk.id == "DVDK") {
      console.log("DVDK DRM: this file depends on keys from the DVD it probably came from.");
      console.log('%s, %d', chunk.id, chunk.size, chunk);
      // TODO: document PWD1 PWD2 PXLS and TEST DRM modes
    } else {
      console.log('%s, %d', chunk.id, chunk.size, chunk);
    }
  }
}

iterate(file, 0);

if (!success) {
  // Let's try some new things. Like seeking for a SINF on the file, and start from there...
}
