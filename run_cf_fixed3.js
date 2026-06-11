
process.argv = [process.argv[0]];

const path = require("path");
const distIndex = path.join(__dirname, "node_modules", "@cloudflare", "next-on-pages", "dist", "index.js");

try {
    require(distIndex);
} catch(e) {
    console.error("Error:", e.message);
    process.exit(1);
}
