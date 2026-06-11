
process.argv = [process.argv[0]];

const path = require("path");
const distIndex = path.join(__dirname, "node_modules", "@cloudflare", "next-on-pages", "dist", "index.js");

console.log("Loading:", distIndex);
console.log("process.argv:", JSON.stringify(process.argv));

try {
    require(distIndex);
} catch(e) {
    console.error("Error:", e.message);
    console.error("Stack:", e.stack);
    process.exit(1);
}
