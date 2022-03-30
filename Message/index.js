import Els from "../Win/Els.js";
import "../css/message.css";


class Message {
  constructor(option) {
    if (option) {
      this.msg = option.msg || option;
      this.type = option.type;
      this.time = option.time;
      Message.__createElement(this.msg, this.type, this.time);
    }
  }
  static __createElement(msg, type, time = 3000) {
    let message = Els.createElement("new-window-message");
    if (type) {
      message.classList.add(type)
    }
    message.innerText = msg;
    document.body.appendChild(message);
    setTimeout(function () {
      document.body.removeChild(message);
    }, time);
  }
  static error(message) {
    Message.__createElement(message, "error");
  }
  static success(message) {
    Message.__createElement(message, "success");
  }
}

export default Message