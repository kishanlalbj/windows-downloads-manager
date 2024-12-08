#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const arg = require("arg");
const chalk = require("chalk");
const packageJson = require("../package.json");
const createLogger = require("../logger");

const logger = createLogger();

const args = arg({
  "--source": String,
  "--extensions": [String],
  "--help": Boolean,
  "-h": "--help",
  "-s": "--source",
  "-v": Boolean
});

if (args["--help"]) printHelp();

if (args["-v"]) printVersion();

// Setting default path to Downloads
let DEFAULT_PATH = path.join(os.homedir(), "Downloads");
let extMap = {};

try {
  if (process.platform !== "win32") {
    throw new Error("We don't support your operating system");
  }

  const validPathRegex = /^[a-zA-Z]:\\(?:[\w\-. ]+(?:\\[\w\-. ]+)*\\?)$/;

  let extensions = args["--extensions"];

  // Without extension flag we dont know how to organize, hence throwing error
  if (!extensions) {
    throw new Error("Extensions are mandatory.");
  }

  let extensionNames = args["--extensions"][0].split(" ");

  // Creating a map between fileExtension and folder to be created.
  extensionNames.forEach((t) => {
    const type = t.split(":")[0];
    const folder = t.split(":")[1];

    extMap[type] = folder;
  });

  if (args["--source"]) {
    const userPath = args["--source"];

    const isValid = validPathRegex.test(userPath);

    if (!isValid) throw new Error(`${userPath} is not provide a valid path`);

    // override default path
    DEFAULT_PATH = userPath;
  }

  startOrganizing(extMap);
} catch (error) {
  logger.warning(error.message);
  process.exit(1);
}

function startOrganizing() {
  logger.highlight(DEFAULT_PATH);

  const allFilesAndFolders = fs.readdirSync(DEFAULT_PATH);

  allFilesAndFolders.forEach((file) => {
    const FILE_PATH = `${DEFAULT_PATH}/${file}`;

    const fileDetails = fs.statSync(FILE_PATH);

    if (!fileDetails.isFile()) return;

    // Get file extension
    const ext = path.extname(FILE_PATH);

    // Get all available extensions from map
    const availableExts = Object.keys(extMap);

    // if no extensions just return
    if (!availableExts.length) return;

    // When you find the file extension in extensions map, create folder and move file
    if (availableExts.includes(ext)) {
      const dirName = extMap[ext];
      const DIR_PATH = `${DEFAULT_PATH}/${dirName}`;

      if (!fs.existsSync(DIR_PATH)) {
        fs.mkdirSync(DIR_PATH);
      }

      fs.renameSync(FILE_PATH, `${DIR_PATH}/${file}`);
    }
  });

  // console.log(chalk.green("Done."));
  logger.log("Done");
  process.exit(0);
}

function printHelp() {
  logger.log("--source, -s        Source directory path");
  logger.log(
    "--extensions, -e   Extesnion Mapping of files and folders. Ex, .jpg:Images"
  );
  logger.log("--help, -h          Help on using the cli");
  logger.log("--version. -v       Version of the cli");

  process.exit(0);
}

function printVersion() {
  logger.log(`Version ${packageJson.version}`);
  process.exit(0);
}
