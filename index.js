const Win = require("./Win/index.js")["default"];
const Message = require("./Message/index.js")["default"];
const MessageBox = require("./MessageBox/index.js")["default"];
const Rclick = require("./Rclick/index")["default"];

function install(app) {
  app.config.globalProperties.Win = Win;
  app.config.globalProperties.Message = Message;
  app.config.globalProperties.MessageBox = MessageBox;
  app.directive("Rclick", Rclick);
}


exports.Rclick = Rclick;
exports.Win = Win;
exports.Message = Message;
exports.MessageBox = MessageBox;
exports.install = install;
