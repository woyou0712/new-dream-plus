import createElement from "../utils/createElement";
import { loadingIcon } from "../svg/icons";
import { LoadingConfig, LoadingOption } from "./Loading.d";

export class Loading {
  private box: HTMLElement;
  private content: HTMLElement;
  private iconBox: HTMLElement;
  private textBox: HTMLElement;
  private defaultIcon: string;
  private heartbeatIcon: HTMLElement;
  private skipIcon: HTMLElement;
  constructor() {
    this.box = createElement("new-window-loading-box");
    this.content = createElement();
    this.iconBox = createElement("new-window-loading-icon-box");
    this.textBox = createElement("new-window-loading-text-box");
    this.defaultIcon = loadingIcon;
    this.heartbeatIcon = createElement("new-window-loading-icon-heartbeat-box");
    [0, 1, 2, 3, 4, 5].forEach((i) => {
      const ic = createElement(["new-window-loading-icon-heartbeat", `index-${i}`]);
      this.heartbeatIcon.appendChild(ic);
    });
    this.skipIcon = createElement("new-window-loading-icon-skip");
    this.content.appendChild(this.iconBox);
    this.content.appendChild(this.textBox);
    this.box.appendChild(this.content);
  }

  private renderLoading(config: LoadingConfig) {
    this.box.style["backgroundColor"] = config.backgroundColor;
    this.content.className = `new-window-loading-content ${config.type}`;
    this.content.style["color"] = config.color;
    const textItems = config.text.split("");
    this.textBox.innerHTML = "";
    textItems.forEach((s, i) => {
      const str = createElement(["new-window-loading-text-item", `index-${i}`]);
      str.innerText = s;
      this.textBox.appendChild(str)
    })

    // 类型图形变换
    this.iconBox.innerHTML = "";
    if (config.type === "default") {
      this.iconBox.innerHTML = this.defaultIcon;
    } else if (config.type === "heartbeat") {
      const nodes = this.heartbeatIcon.childNodes;
      nodes.forEach(e => {
        (e as HTMLElement).style["backgroundColor"] = config.color;
      });
      this.iconBox.appendChild(this.heartbeatIcon);
    } else if (config.type === "skip") {
      this.skipIcon.style["borderColor"] = config.color;
      this.skipIcon.style["backgroundColor"] = config.color;
      this.iconBox.appendChild(this.skipIcon);
    }
    document.body.appendChild(this.box);
  }


  public start(config?: LoadingOption | string) {
    const conf: LoadingConfig = { text: "拼命加载中...", type: "default", backgroundColor: "rgba(0,0,0,.8)", color: "#409EFF" };
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
    this.renderLoading(conf);
  }

  public close() {
    const parentNode = this.box.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.box)
    }
  }

}

export const $Loading = Loading

