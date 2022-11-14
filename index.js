#!/usr/bin/env node
import spawn from "cross-spawn";
import chalk from "chalk";

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
    spawn("depcheck --ignores @types/*", inherit);
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
  case "s":
    spawn("ng s --port=4201 --disable-host-check", inherit);
    break;
  case "v":
    spawn("ng v", inherit);
    break;
  case "y":
    log(red("Commands:"));
    log(red("gadd: ") + yellow("yarn global add ") + magenta("package-name "));
    log(red("yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
    log(red("  ya: ") + yellow("yarn audit"));
    log(red("  yg: ") + yellow("yarn global list"));
    log(red("  yo: ") + yellow("yarn outdated"));
    log(red("  yr: ") + yellow("yarn remove ") + magenta("package-name"));
    log(red("  ys: ") + yellow("yarn start"));
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
    spawn("yarn outdated", inherit);
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
    log(red("   s: ") + yellow("ng serve ") + green("--port=4201 --disable-host-check"));
    log(red("   v: ") + yellow("ng version"));
    log(red("gadd: ") + yellow("yarn global add ") + magenta("package-name"));
    log(red("yadd: ") + yellow("yarn add ") + magenta("package-name ") + green("-D"));
    log(red("  ya: ") + yellow("yarn audit"));
    log(red("  yg: ") + yellow("yarn global list"));
    log(red("  yo: ") + yellow("yarn outdated"));
    log(red("  yr: ") + yellow("yarn remove ") + magenta("package-name"));
    log(red("  ys: ") + yellow("yarn start"));
}
