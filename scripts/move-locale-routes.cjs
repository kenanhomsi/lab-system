const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..", "src", "app");
const localeDir = path.join(appDir, "[locale]");

fs.mkdirSync(localeDir, { recursive: true });

function moveDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
}

for (const name of ["(website)", "(auth)", "(dashboard)"]) {
  const from = path.join(appDir, name);
  const to = path.join(localeDir, name);
  if (fs.existsSync(from)) {
    moveDir(from, to);
    console.log("moved", name);
  } else {
    console.warn("skip missing", from);
  }
}
