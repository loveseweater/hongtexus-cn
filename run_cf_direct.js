
process.argv = [process.argv[0], "dist/index.js"];

const path = require("path");
const distIndex = path.join(__dirname, "node_modules", "@cloudflare", "next-on-pages", "dist", "index.js");

// Clear require cache
delete require.cache[require.resolve(distIndex)];

try {
    require(distIndex);
} catch(e) {
    console.error("Error:", e.message);
    process.exit(1);
}
