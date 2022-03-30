import Els from "../Win/Els.js";
import "../css/message.css";


class Message {
  constructor(option) {
    if (option) {
      this.msg = option.msg || option;
      this.type = option.type;
      this.time = option.time || 3000;
      this.__createElement();
    }
    this.time = 3000;
  }
  __createElement() {
    let message = Els.createElement("new-message-box");
    if (this.type) {
      message.classList.add(this.type)
    }
    message.innerText = this.msg;
    document.body.appendChild(message);
    setTimeout(function () {
      document.body.removeChild(message);
    }, this.time);
  }
  error(message) {
    this.type = "error";
    this.msg = message;
    this.__createElement();
  }
  success(message) {
    this.type = "success";
    this.msg = message;
    this.__createElement();
  }
}

export default Message