
const { spawn } = require("child_process");
const { join } = require("path");

const child = spawn(
    process.execPath,
    [join(__dirname, "node_modules/@cloudflare/next-on-pages/dist/index.js")],
    {
        cwd: __dirname,
        stdio: ["inherit", "pipe", "pipe"],
        env: { ...process.env }
    }
);

let output = "";
child.stdout.on("data", d => { output += d.toString(); process.stdout.write(d); });
child.stderr.on("data", d => { output += d.toString(); process.stderr.write(d); });

child.on("close", code => {
    require("fs").writeFileSync("build_direct.log", output);
    process.exit(code);
});
