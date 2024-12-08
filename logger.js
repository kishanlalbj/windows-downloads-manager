const chalk = require("chalk");

module.exports = function createLogger() {
  return {
    log: (...args) => console.log(chalk.white(...args)),
    warning: (...args) => console.log(chalk.yellow(...args)),
    highlight: (...args) => console.log(chalk.bgCyanBright(...args))
  };
};
