#!/usr/bin/env node
import spawn from "cross-spawn";
import chalk from "chalk";
import depcheck from "depcheck";
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

switch(process.argv[2]) {
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
    if (process.argv[3]) {
      spawn("git cherry-pick", [process.argv[3]], inherit);
    } else {
      log(red("Usage:"));
      log(red("   gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    }
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
    let __filename, __dirname, fileInputs, folder, port;
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
    fileInputs = fs.readFileSync(__dirname + "\\file.txt", "utf8").split('\n');
    if (process.argv[3] === "c") {
      folder = fileInputs[0];
    } else if (process.argv[3] === "s") {
      folder = fileInputs[1];
    }
    if (process.argv[3] === "c" || process.argv[3] === "s") {
      if (process.argv[4] === "2") {
        port = fileInputs[3];
      } else {
        port = fileInputs[2];
      }
      log(yellow("yarn --cwd ../" + cyan("folder") + " build && ng serve --disable-host-check --port=") + cyan("port"));
      log(magenta(folder)) + log(magenta(port));
      spawn("yarn --cwd ../" + folder + " build && ng serve --disable-host-check --port=" + port, inherit);
    }

    if (!process.argv[3]) {
      port = fileInputs[2];
    } else if(process.argv[3] === "2") {
      port = fileInputs[3];
    }
    if (!process.argv[3] || process.argv[3] === "2") {
      log(yellow("ng s --port=") + cyan("port ") + yellow("--disable-host-check"), magenta(port));
      spawn("ng s --port=" + port + " --disable-host-check", inherit);
    }
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
    log(yellow("ng version && yarn -v"));
    spawn("ng v && yarn -v", inherit);
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
    log(red("   g: ") + yellow("npm ls ") + green("-g --depth=0") + yellow(" && yarn global list"));
    log(red("  gc: ") + yellow("git cherry-pick ") + magenta("commit-hash"));
    log(red("   p: ") + yellow("Display scripts from package.json"));
    log(red("   s: ") + yellow("ng serve ") + green("--port=") + cyan("port ") + green("--disable-host-check"));
    log(red("    s (c/s) (#): ") + yellow("yarn --cwd ../") + cyan("folder") + yellow(" build && ng serve ") +
      green("--disable-host-check --port=") + cyan("port"));
    log(red("   t: ") + yellow("ng test ") + green("--include=**\\") + magenta("folder-name") + green("\\*.spec.ts"));
    log(red("    t i: ") + yellow("ng test ") + green("--include=**\\") + magenta("file-name") + green(".spec.ts"));
    log(red("   v: ") + yellow("ng version && yarn -v"));
    yarnCommands();
}

function yarnCommands() {
  log(red("gadd: ") + yellow("yarn global add ") + magenta("package-name"));
  log(red("yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
  log(red("  ya: ") + yellow("yarn audit"));
  log(red("  yo: ") + yellow("yarn outdated"));
  log(red("  yr: ") + yellow("yarn remove ") + magenta("package-name"));
  log(red("  ys: ") + yellow("yarn start"));
}
