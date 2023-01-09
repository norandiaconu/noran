#!/usr/bin/env node
import spawn from "cross-spawn";
import chalk from "chalk";
import depcheck from "depcheck";
import * as fs from "fs";

const inherit = { stdio: "inherit" };
const log = console.log;
const red = chalk.red;
const yellow = chalk.yellow;
const magenta = chalk.magenta;
const green = chalk.green;

switch(process.argv[2]) {
  case "b":
    spawn("ng build", inherit);
    break;
  case "c":
    spawn("cost-of-modules --no-install --include-dev", inherit);
    break;
  case "d":
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
  case "gc":
    if (process.argv[3]) {
      spawn("git cherry-pick", [process.argv[3]], inherit);
    } else {
      log(red("Usage:"));
      log(red("   gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    }
    break;
  case "ng":
    spawn("npm ls -g --depth=0", inherit);
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
    spawn("ng s --port=4201 --disable-host-check", inherit);
    break;
  case "t":
    if (!process.argv[3]) {
      spawn("ng test", inherit);
    } else {
      if (!process.argv[4]) {
        spawn("ng test --include=**\\" + process.argv[3] + "\\*.spec.ts", inherit);
      } else {
        if (process.argv[3] === "i" || process.argv[3] === "individual" || process.argv[3] === "file") {
          spawn("ng test --include=**\\" + process.argv[4] + ".spec.ts", inherit);
        } else {
          spawn("ng test --include=**\\" + process.argv[3] + "\\*.spec.ts", inherit);
        }
      }
    }
    break;
  case "v":
    spawn("ng v", inherit);
    break;
  case "y":
    log(red("Commands:"));
    yarnCommands();
    break;
  case "gadd":
    if (process.argv[3]) {
      spawn("yarn global add", [process.argv[3]], inherit);
    } else {
      log(red("Usage:"));
      log(red(" gadd: ") + yellow("yarn global add ") + magenta("package-name "));
    }
    break;
  case "yadd":
    if (process.argv[3]) {
      spawn("yarn add", [process.argv[3], "-D"], inherit);
    } else {
      log(red("Usage:"));
      log(red(" yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
    }
    break;
  case "ya":
    spawn("yarn audit", inherit);
    break;
  case "yg":
    spawn("yarn global list", inherit);
    break;
  case "yo":
    spawn("yarn outdated", inherit).on("error", function(err) {
      if (err.code !== "ENOENT") {
        log(err);
      }
    });
    break;
  case "yr":
    if (process.argv[3]) {
      spawn("yarn remove", [process.argv[3]], inherit);
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
    log(red("  ng: ") + yellow("npm list ") + green("-g --depth=0"));
    log(red("  gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    log(red("   p: ") + yellow("Display scripts from package.json"));
    log(red("   s: ") + yellow("ng serve ") + green("--port=4201 --disable-host-check"));
    log(red("   t: ") + yellow("ng test ") + green("--include=**\\") + magenta("folder-name") + green("\\*.spec.ts"));
    log(red(" t i: ") + yellow("ng test ") + green("--include=**\\") + magenta("file-name") + green(".spec.ts"));
    log(red("   v: ") + yellow("ng version"));
    yarnCommands();
}

function yarnCommands() {
  log(red("gadd: ") + yellow("yarn global add ") + magenta("package-name"));
  log(red("yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
  log(red("  ya: ") + yellow("yarn audit"));
  log(red("  yg: ") + yellow("yarn global list"));
  log(red("  yo: ") + yellow("yarn outdated"));
  log(red("  yr: ") + yellow("yarn remove ") + magenta("package-name"));
  log(red("  ys: ") + yellow("yarn start"));
}
