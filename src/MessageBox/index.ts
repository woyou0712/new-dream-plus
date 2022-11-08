import createElement from "../utils/createElement"
import { MsgBoxOption, MsgBoxMethod } from "./msgBox.d"

export class MessageBox {
  static defaultContentBox = document.body;

  private title = "提示";
  private msg = "确认消息";
  private cancelName = "取消";
  private submitName = "确定";

  private el: HTMLElement;
  private methods: MsgBoxMethod = {};

  constructor(option: MsgBoxOption) {
    if (typeof option === "string") {
      this.msg = option;
    } else if (option) {
      if (option.msg) {
        this.msg = option.msg;
      }
      if (option.title) {
        this.title = option.title;
      }
      if (option.cancelName) {
        this.cancelName = option.cancelName;
      }
      if (option.submitName) {
        this.submitName = option.submitName;
      }
    }
    this.el = this.__create__element();
    // 渲染到页面
    MessageBox.defaultContentBox.appendChild(this.el);
  }
  private __create__element() {
    const box = createElement("new-window-message-box");
    const head = createElement("head");
    head.innerText = this.title;
    box.appendChild(head);


    const content = createElement("content");
    content.innerText = this.msg;
    box.appendChild(content);

    const btns = createElement("btns");
    const cancelBtn = createElement("btn");
    cancelBtn.innerText = this.cancelName;
    cancelBtn.addEventListener("click", () => {
      this.close();
      if (this.methods.cancel) {
        this.methods.cancel();
      }
    })
    btns.appendChild(cancelBtn);
    const submitBtn = createElement("btn primary");
    submitBtn.innerText = this.submitName;
    submitBtn.addEventListener("click", () => {
      this.close();
      if (this.methods.submit) {
        this.methods.submit();
      }
    })
    btns.appendChild(submitBtn);

    box.appendChild(btns);
    return box
  }
  /**
   * 关闭窗口
   */
  private close() {
    const p = this.el.parentNode;
    if (p) {
      p.removeChild(this.el)
    }
  }

  /**
   * 取消回调函数
   */
  cancel(callback: () => void) {
    this.methods.cancel = callback;
    return this
  }
  /**
   * 确定回调函数
   */
  submit(callback: () => void) {
    this.methods.submit = callback;
    return this
  }
}



export const $MessageBox = MessageBox