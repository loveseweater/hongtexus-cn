
// Fix process.argv - commander uses this
process.argv = [process.argv[0], process.argv[1]];

// Now require and run
require("./node_modules/@cloudflare/next-on-pages/dist/index.js");
