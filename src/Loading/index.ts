import createElement from "../utils/createElement";
import { loadingIcon } from "../svg/icons";
import { LoadingConfig } from "./Loading.d";

export class Loading {
  private box: HTMLElement;
  private content: HTMLElement;
  private iconBox: HTMLElement;
  private textBox: HTMLElement;
  constructor(config?: LoadingConfig | string) {
    const conf = { text: "拼命加载中...", type: "default", backgroundColor: "rgba(0,0,0,.8)", color: "#E6A23C" }
    if (config) {
      if (typeof config === "string") {
        conf.text = config;
      } else {
        if (config.text) { conf.text = config.text }
        if (config.backgroundColor) { conf.backgroundColor = config.backgroundColor }
        if (config.type) { conf.type = config.type }
        if (config.color) { conf.color = config.color }
      }
    }
    this.box = createElement("new-window-loading-box");
    this.box.style["backgroundColor"] = conf.backgroundColor;
    this.content = createElement(["new-window-loading-content", conf.type]);
    this.content.style["color"] = conf.color;
    this.iconBox = createElement("new-window-loading-icon-box");
    // 类型图形变换
    if (conf.type === "default") {
      this.iconBox.innerHTML = loadingIcon
    } else if (conf.type === "skip") {
      [null, null, null, null, null, null].forEach((e, i) => {
        const ic = createElement(["new-window-loading-icon-skip", `index-${i}`]);
        ic.style["backgroundColor"] = conf.color;
        this.iconBox.appendChild(ic);
      })
    } else if (conf.type === "heartbeat") {
      const ic = createElement("new-window-loading-icon-heartbeat");
      ic.style["borderColor"] = conf.color;
      ic.style["backgroundColor"] = conf.color;
      this.iconBox.appendChild(ic);
    }


    this.textBox = createElement("new-window-loading-text-box");
    const textItems = conf.text.split("");
    textItems.forEach((s, i) => {
      const str = createElement(["new-window-loading-text-item", `index-${i}`]);
      str.innerText = s;
      this.textBox.appendChild(str)
    })
    this.renderLoading();
  }

  private renderLoading() {


    this.content.appendChild(this.iconBox);
    this.content.appendChild(this.textBox);
    this.box.appendChild(this.content);
    document.body.appendChild(this.box);
  }

  public close() {
    const parentNode = this.box.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.box)
    }
  }

}

export const $Loading = Loading

