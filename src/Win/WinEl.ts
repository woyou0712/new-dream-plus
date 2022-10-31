import createElement from "../utils/createElement";
import { closeSvg, maxSvg, unmaxSvg, miniSvg } from "../svg/button"
import { Config, Status } from "./win"
import { Win } from ".";
import { createApp } from "vue";


export class WinEl {
  public box: HTMLElement;
  private header: HTMLElement;
  public title: HTMLElement;
  private icon: HTMLElement;
  private name: HTMLElement;
  public move: HTMLElement;
  public btnbox: HTMLElement;
  public minimize: HTMLElement;
  public maximize: HTMLElement;
  public close: HTMLElement;
  public content: HTMLElement;
  public miniEl: HTMLElement;

  constructor(config: Config) {
    this.box = createElement(["new-windows-box", "initial"]); // 外层盒子
    this.header = createElement("new-windows-header"); // 头部
    this.title = createElement("new-windows-title"); // 标题
    this.icon = createElement("new-windows-icon"); // 图标
    this.name = createElement("new-windows-name"); // 标题名称
    this.move = createElement("new-windows-move"); // 可拖动区域
    this.btnbox = createElement("new-windows-btnbox"); // 右侧按钮盒子    
    this.minimize = createElement(["new-windows-btn", "new-windows-minimize"]); // 最小化 按钮
    this.maximize = createElement(["new-windows-btn", "new-windows-maximize"]); // 最大化 按钮
    this.close = createElement(["new-windows-btn", "new-windows-close"]); // 关闭 按钮
    this.content = createElement("new-windows-content"); // 内容区域
    this.miniEl = createElement("new-windows-mini-list-box"); // 最小化列表
    this.__init__attribute__content(config);
    this.__init__correlation();
  }
  /**
   * 初始化属性
   */
  private __init__attribute__content(config: Config) {
    // 按钮图标填充
    this.minimize.innerHTML = miniSvg;
    this.maximize.innerHTML = maxSvg;
    this.close.innerHTML = closeSvg;
    // 配置项数据填充
    if (typeof config.icon === "string") {
      this.icon.innerHTML = config.icon;
    } else if (config.icon) {
      this.icon.appendChild(config.icon);
    }
    if (config.title) {
      this.name.innerText = config.title;
    }
    if (!config.miniBtn) {
      this.minimize.style.display = "none";
    }
    if (!config.maxBtn) {
      this.maximize.style.display = "none";
    }
    if (config.resize) {
      this.box.style.resize = "both";
    }
    if (config.width) {
      this.box.style.width = config.width;
    }
    if (config.height) {
      this.box.style.height = config.height;
    }
    const { top, left } = this.__init__position(config);
    this.box.style.top = `${top}px`;
    this.box.style.left = `${left}px`;
    // 设置内容
    this.__set_content(config);
  }
  /**
   * 初始化元素关系
   */
  private __init__correlation() {
    this.title.appendChild(this.icon);
    this.title.appendChild(this.name);
    this.btnbox.appendChild(this.minimize);
    this.btnbox.appendChild(this.maximize);
    this.btnbox.appendChild(this.close);

    this.header.appendChild(this.title);
    this.header.appendChild(this.move);
    this.header.appendChild(this.btnbox);
    this.box.appendChild(this.header);

    this.content.appendChild(this.miniEl);
    this.box.appendChild(this.content);
  }

  /**
   * 计算初始位置
   */
  private __init__position(config: Config) {
    let top = 0, left = 0;
    const reg = /[^\d]/g;
    const width = config.width?.replace(reg, ""), height = config.height?.replace(reg, "");
    // 如果有父节点ID
    if (config.parentId && Win.WinIdMap[config.parentId]) {
      const parentWin = Win.WinIdMap[config.parentId];
      if (parentWin.__Els) {
        this.box.style['position'] = 'absolute';
        top = (parentWin.__Els.content.offsetHeight - Number(height)) / 2;
        left = (parentWin.__Els.content.offsetWidth - Number(width)) / 2;
        return { top: top < 0 ? 0 : top, left: left < 0 ? 0 : left }
      }
    }
    this.box.style['position'] = 'fixed';
    top = (window.innerHeight - Number(height)) / 2;
    left = (window.innerWidth - Number(width)) / 2;
    return { top: top < 0 ? 0 : top, left: left < 0 ? 0 : left }
  }

  private __set_content(config: Config) {
    // 挂载内容 如果是VUE组件
    if (config.component) {
      const props = config.props ? config.props : {}
      const component = createApp(config.component, props); // 解析渲染VUE组件
      component.mount(this.content)
    } else if (config.url) {
      const iframe = createElement({ class: "new-windows-html", name: "iframe" })
      /**
       * 启用sandbox属性，限制内部网页污染，值为空为启用所有限制
       * allow-downloads-without-user-activation：允许内嵌网页不经使用者允许下载文件
       * allow-downloads：内嵌网页下载文件需要使用者允许
       * allow-forms：允许内嵌网页提交表单，如果关键词没有用，那么表单的提交就冻结了
       * allow-modals：让内嵌网页打开模态窗
       * allow-orientation-lock：允许内嵌网页锁定屏幕插件
       * allow-pointer-lock：
       * allow-popups：允许内嵌网页弹窗
       * allow-popups-to-escape-sandbox：
       * allow-presentation：
       * allow-same-origin：允许同源
       * allow-scripts：允许内嵌网址运行script脚本（但是不能创造弹窗）
       * allow-storage-access-by-user-activation：允许内嵌网页在使用者许可的情况下使用父网页的存储
       * allow-top-navigation：允许内嵌网页的最高级内容的打开
       * allow-top-navigation-by-user-activation：允许内嵌网页的最高级内容在使用者许可的情况下打开
       *  */
      if (config.sandbox && config.sandbox.length) {
        const sandbox = config.sandbox.join(" ")
        iframe.setAttribute("sandbox", sandbox)
      }
      iframe.setAttribute("src", config.url)
      this.content.appendChild(iframe)
    }
  }

  /**
   * 还原
   */
  setInitial(upStatus: Status) {
    this.box.classList.add("initial");
    this.box.classList.remove("mini");
    this.box.classList.remove("max");
    if (upStatus === "mini") {
      this.minimize.innerHTML = miniSvg;
    } else {
      this.maximize.innerHTML = maxSvg;
    }

  }
  /**
   * 最大化
   */
  setMax(upStatus: Status) {
    this.box.classList.add("max");
    this.box.classList.remove("initial");
    this.box.classList.remove("mini");
    this.maximize.innerHTML = unmaxSvg;
    if (upStatus === "mini") {
      this.minimize.innerHTML = miniSvg;
    }
  }


  /**
   * 最小化
   */
  setMini() {
    this.box.classList.add("mini");
    this.box.classList.remove("initial");
    this.box.classList.remove("max");
    this.minimize.innerHTML = maxSvg;
  }
}