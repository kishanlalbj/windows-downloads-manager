#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const arg = require("arg");
const chalk = require("chalk");
const packageJson = require("../package.json");

const downloadPathRegex = /^(?:[A-Za-z]:\\)?(?:Users\\[^\\]+\\)?Downloads\\?$/;
let DOWNLOADS_PATH;

try {
  const args = arg({
    "--path": String,
    "--help": Boolean,
    "-h": "--help",
    "-p": "--path",
    "-v": Boolean
  });

  if (args["--path"]) {
    if (process.platform !== "win32")
      throw new Error("Currenly we only support Windows");

    if (downloadPathRegex.test(args["--path"])) {
      DOWNLOADS_PATH = args["--path"];
      startOrganizing();
    } else {
      throw new Error("Not a valid windows downloads path !");
    }
  }

  if (args["--help"]) {
    console.log(`${chalk.blue("--path, -p")} Path to your downloads folder`);
    console.log(`${chalk.blue("--help, -h")} Help with commands`);
    console.log(`${chalk.blue("--v")}        Version of the CLI`);
    process.exit(0);
  }

  if (args["-v"]) {
    console.log(`Version ${packageJson.version}`);
    process.exit(0);
  }
} catch (error) {
  console.log(chalk.red(error.message));
  console.log();
  process.exit(1);
}

function startOrganizing() {
  const allFilesAndFolders = fs.readdirSync(DOWNLOADS_PATH);

  allFilesAndFolders.forEach((file) => {
    const FILE_PATH = `${DOWNLOADS_PATH}/${file}`;

    const fileDetails = fs.statSync(FILE_PATH);

    if (fileDetails.isFile()) {
      const ext = path.extname(FILE_PATH);

      const dirName = `${ext?.substring(1, ext.length)}s`;

      const DIR_PATH = `${DOWNLOADS_PATH}/${dirName}`;

      if (!fs.existsSync(DIR_PATH)) {
        console.log(chalk.green("Creating directory ", dirName));
        fs.mkdirSync(DIR_PATH);
      }

      console.log(chalk.blue(" - Moving file to directory"));
      fs.renameSync(FILE_PATH, `${DIR_PATH}/${file}`);
    }
  });

  console.log(chalk.green("Done."));
  process.exit(0);
}
