import createElement from "../utils/createElement";
import { MsgType, MsgOption } from "./msg.d"

export class Message {
  static defaultContentBox = document.body;

  private msg = "轻提示";
  private type: MsgType = "info";
  private time = 3000;
  constructor(option: MsgOption) {
    if (typeof option === "string") {
      this.msg = option
    } else if (option) {
      this.msg = option.msg
      if (option.type) {
        this.type = option.type
      }
      if (option.time) {
        this.time = option.time
      }
    }
    this.__show_message();
  }
  private __show_message() {
    const msgBox = createElement("new-window-message");
    msgBox.classList.add(this.type);
    msgBox.innerText = this.msg;
    Message.defaultContentBox.appendChild(msgBox);
    setTimeout(function () {
      const p = msgBox.parentNode;
      if (p) {
        p.removeChild(msgBox);
      }
    }, this.time);
  }
  static error(msg: string) {
    new Message({ msg: msg, type: "error" })
  }
  static success(msg: string) {
    new Message({ msg: msg, type: "success" })
  }
  static info(msg: string) {
    new Message({ msg: msg, type: "info" })
  }
}

export const $Message = Message