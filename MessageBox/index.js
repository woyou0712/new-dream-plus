import Win from "../Win/index.js"
import Els from "../Win/Els.js";
import "../css/messageBox.css";

class MessageBox {
  constructor(option) {
    this.parentBox = document.body;
    this.title = "提示";
    this.msg = "提示消息！";
    this.cancelName = "取消";
    this.submitName = "确定";
    if (typeof option === "string") {
      this.msg = option;
    } else {
      if (option.parentId && Win.allMap[option.parentId]) {
        this.parentBox = Win.allMap[option.parentId].els.content;
      }
      if (option.title) { this.title = option.title }
      if (option.msg) { this.msg = option.msg }
      if (option.cancelName) { this.cancelName = option.cancelName }
      if (option.submitName) { this.submitName = option.submitName }
    }
    this.__setMethods();
    this.__createElement();
  }
  __setMethods() {
    this.__oncancel = null;
    this.__cancel = () => {
      this.parentBox.removeChild(this.message)
      setTimeout(() => {
        if (typeof this.__oncancel === "function") {
          this.__oncancel();
        }
      })
    }
    this.__onsubmit = null;
    this.__submit = () => {
      this.parentBox.removeChild(this.message)
      setTimeout(() => {
        if (typeof this.__onsubmit === "function") {
          this.__onsubmit();
        }
      })
    }

  }
  __createElement() {
    this.message = Els.createElement("new-window-message-box");
    let head = Els.createElement("head");
    head.innerText = this.title;
    this.message.appendChild(head)


    let content = Els.createElement("content");
    content.innerText = this.msg;
    this.message.appendChild(content)

    let btns = Els.createElement("btns");
    let btn1 = Els.createElement("btn");
    btn1.innerText = this.cancelName;
    btn1.onclick = this.__cancel
    let btn2 = Els.createElement("btn primary");
    btn2.innerText = this.submitName;
    btn2.onclick = this.__submit
    btns.appendChild(btn1)
    btns.appendChild(btn2)

    this.message.appendChild(btns)
    this.parentBox.appendChild(this.message);

  }
  cancel(fn) {
    this.__oncancel = fn
  }
  submit(fn) {
    this.__onsubmit = fn
  }
}



export default MessageBox