#!/usr/bin/env node
import spawn from "cross-spawn";
import chalk from "chalk";
import depcheck from "depcheck4";
import * as fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const inherit = { stdio: "inherit" };
const log = console.log;
const red = chalk.red;
const yellow = chalk.yellow;
const magenta = chalk.magenta;
const green = chalk.green;
const cyan = chalk.cyan;
const p2 = process.argv[2];
const p3 = process.argv[3];
let __filename, __dirname, fileInputs, param;

switch(p2) {
  case "b":
    log(yellow("ng build"));
    spawn("ng build", inherit);
    break;
  case "c":
    log(yellow("cost-of-modules ") + green("--no-install --include-dev"));
    spawn("cost-of-modules --no-install --include-dev", inherit);
    break;
  case "d":
    log(yellow("depcheck"));
    depcheck(process.cwd(), { ignoreMatches: ["@types/*"] }).then(unused => {
      if (unused.dependencies.length !== 0) {
        log("Unused dependencies\n", unused.dependencies);
      }
      if (unused.devDependencies.length !== 0) {
        log("Unused devDependencies\n", unused.devDependencies);
      }
      log(green("depcheck done"));
    });
    break;
  case "g":
    log(yellow("npm ls ") + green("-g --depth=0") + yellow(" && yarn global list"));
    spawn("npm ls -g --depth=0 && yarn global list", inherit);
    break;
  case "gc":
    if (p3) {
      log(yellow("git cherry-pick ") + magenta(p3));
      spawn("git cherry-pick", [p3], inherit);
    } else {
      log(red("Usage:"));
      log(red("   gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    }
    break;
  case "l":
    readFile();
    log(yellow("yarn link "), magenta(param));
    spawn("yarn link " + param, inherit);
    break;
  case "ul":
    readFile();
    log(yellow("yarn unlink "), magenta(param));
    spawn("yarn unlink " + param, inherit);
    break;
  case "p":
    fs.readFile("./package.json", "utf8", (err, jsonString) => {
      const packageRegex = /\"scripts\": {\s\n?(.*?)\s*},/s;
      const regexArray = packageRegex.exec(jsonString);
      if (regexArray) {
        const scripts = regexArray[1].replace(/\"|,/g, "");
        const scriptsArray = scripts.split("\n");
        const scriptsRegex = /(.*?)(: )(.*)/;
        scriptsArray.forEach(script => {
          const commandParts = scriptsRegex.exec(script);
          if (commandParts) {
            log(red(commandParts[1]) + commandParts[2] + yellow(commandParts[3]));
          } else {
            log(script);
          }
        });
      } else {
        log(red("No scripts found\n") + jsonString);
      }
    });
    break;
  case "s":
    readFile();
    if (!p3 || p3 === "1" || p3 === "2" || p3 === "3") {
      log(yellow("ng s --port=") + cyan("port ") + yellow("--public-host=localhost:") + cyan("port ") + yellow("--disable-host-check"), magenta(param));
      spawn("ng s --port=" + param + " --public-host=localhost:" + param + " --disable-host-check", inherit);
    } else {
      log(red("Usage:"));
      log(red("   s: (1/2/3) ") + yellow("ng serve ") + green("--port=") + cyan("port ") + green("--public-host=localhost:")
        + cyan("port ") + green("--disable-host-check"));
    }
    break;
  case "t":
    if (!p3) {
      spawn("ng test", inherit);
    } else {
      if (!process.argv[4]) {
        spawn("ng test --include=**\\" + p3 + "\\*.spec.ts", inherit);
      } else {
        if (p3 === "i" || p3 === "individual" || p3 === "file") {
          spawn("ng test --include=**\\" + process.argv[4] + ".spec.ts", inherit);
        } else {
          spawn("ng test --include=**\\" + p3 + "\\*.spec.ts", inherit);
        }
      }
    }
    break;
  case "v":
    log(yellow("ng version && yarn -v"));
    spawn("ng v && yarn -v", inherit);
    break;
  case "y":
    log(red("Commands:"));
    yarnCommands();
    break;
  case "gadd":
    if (p3) {
      log(yellow("yarn global add ") + magenta(p3));
      spawn("yarn global add", [p3], inherit);
    } else {
      log(red("Usage:"));
      log(red(" gadd: ") + yellow("yarn global add ") + magenta("package-name "));
    }
    break;
  case "gr":
    if (p3) {
      log(yellow("yarn global remove ") + magenta(p3));
      spawn("yarn global remove", [p3], inherit);
    } else {
      log(red("Usage:"));
      log(red("   gr: ") + yellow("yarn global remove ") + magenta("package-name"));
    }
    break;
  case "yadd":
    if (p3) {
      log(yellow("yarn add ") + magenta(p3));
      spawn("yarn add", [p3, "-D"], inherit);
    } else {
      log(red("Usage:"));
      log(red(" yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
    }
    break;
  case "ya":
    spawn("yarn audit", inherit);
    break;
  case "yo":
    spawn("yarn outdated", inherit).on("error", function(err) {
      if (err.code !== "ENOENT") {
        log(err);
      }
    });
    break;
  case "yr":
    if (p3) {
      log(yellow("yarn remove ") + magenta(p3));
      spawn("yarn remove", [p3], inherit);
    } else {
      log(red("Usage:"));
      log(red("   yr: ") + yellow("yarn remove ") + magenta("package-name"));
    }
    break;
  case "ys":
    spawn("yarn start", inherit);
    break;
  default:
    log(red("Commands:"));
    log(red("   b: ") + yellow("ng build"));
    log(red("   c: ") + yellow("cost-of-modules ") + green("--no-install --include-dev"));
    log(red("   d: ") + yellow("depcheck ") + green("--ignores @types/*"));
    log(red("   g: ") + yellow("npm ls ") + green("-g --depth=0") + yellow(" && yarn global list"));
    log(red("  gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    log(red("   l: (c/s) ") + yellow("yarn link ") + cyan("package"));
    log(red("  ul: (c/s) ") + yellow("yarn unlink ") + cyan("package"));
    log(red("   p: ") + yellow("Display scripts from package.json"));
    log(red("   s: (1/2/3) ") + yellow("ng serve ") + green("--port=") + cyan("port ") + green("--public-host=localhost:")
      + cyan("port ") + green("--disable-host-check"));
    log(red("   t: ") + yellow("ng test ") + green("--include=**\\") + magenta("folder-name") + green("\\*.spec.ts"));
    log(red("   t: (i) ") + yellow("ng test ") + green("--include=**\\") + magenta("file-name") + green(".spec.ts"));
    log(red("   v: ") + yellow("ng version && yarn -v"));
    yarnCommands();
}

function readFile() {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
  fileInputs = fs.readFileSync(__dirname + "\\file.txt", "utf8").split('\n');

  if (p2 === "l" || p2 === "ul") {
    if (!p3) {
      param = fileInputs[0];
    } else if (p3 === "c") {
      param = fileInputs[1];
    } else if (p3 === "s") {
      param = fileInputs[2];
    }
  }
  if (p2 === "s") {
    if (!p3 || p3 === "1") {
      param = fileInputs[3];
    } else if(p3 === "2") {
      param = fileInputs[4];
    } else if(p3 === "3") {
      param = fileInputs[5];
    }
  }
}

function yarnCommands() {
  log(red("gadd: ") + yellow("yarn global add ") + magenta("package-name"));
  log(red("  gr: ") + yellow("yarn global remove ") + magenta("package-name"));
  log(red("yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
  log(red("  yr: ") + yellow("yarn remove ") + magenta("package-name"));
  log(red("  ya: ") + yellow("yarn audit"));
  log(red("  yo: ") + yellow("yarn outdated"));
  log(red("  ys: ") + yellow("yarn start"));
}
