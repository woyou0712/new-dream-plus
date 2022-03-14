const Win = require("./Win/index.js")["default"]
const Rclick = require("./Rclick/index")["default"]

function install(app) {
  app.config.globalProperties.Win = Win
  app.directive("Rclick", Rclick);
}


exports.Rclick = Rclick;
exports.Win = Win;
exports.install = install;
