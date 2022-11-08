import { WinEl } from "./WinEl";
import createElement from "../utils/createElement";

import { HtmlConfig, Config, Status, Callback, Callbacks } from "./win.d"
import { chromeSvg } from "../svg/button";
import setConfig from "./methods/setConfig";
import moveWin from "./methods/moveWin";

export const defaultConfig: HtmlConfig = {
  title: "新窗口",
  width: "800px",
  height: "600px",
  miniBtn: false,
  maxBtn: false,
  resize: false,
  icon: chromeSvg,
  url: "http://www.bauble.vip",
  sandbox: []
}



export class Win {
  // 静态属性
  static WinIdMap: { [key: string]: Win } = {}; // 所有已存在窗口的ID映射表
  static Shade = createElement({ id: "new-windows-shade" }); // 拖拽遮罩层，防止卡顿
  static zIndex = 0;
  static showMiniList = true;
  static baseMiniEl: HTMLElement;
  static defaultContentBox = document.body; // 默认内容装载盒子
  // 对象属性
  public id: string;
  public __Els: WinEl;
  public status: Status = "initial";
  private config: Config = defaultConfig;
  private children: { [key: string]: Win } = {};
  private upStatus: Status = "initial"; // 上一次的状态
  private zIndex = Win.zIndex;
  private callbacks: Callbacks = {};

  constructor(config: Config) {
    Win.zIndex += 1;
    this.__config = config || defaultConfig;
    this.id = this.__config.id || Win.createId()
    // 判断窗口是否已经存在
    if (Win.WinIdMap[this.id]) {
      const errMsg = "相同ID窗口已存在！无法继续创建";
      console.error(errMsg)
      throw new Error(errMsg)
    }
    this.__Els = new WinEl(this.__config); // 创建元素
    this.addMoveEvent(); // 添加移动事件
    this.addButtonEvent(); // 为按钮添加事件
    this.__init__show(); // 将窗口挂载到页面
    this.__zIndex = Win.zIndex;

    // 如果需要加载最小化列表，并且根列表没有加载
    if (Win.showMiniList && !Win.baseMiniEl) {
      // 加载根列表
      Win.baseMiniEl = createBaseMiniEl()
    }
  }

  private set __config(config: Config) {
    this.config = setConfig(config, defaultConfig);
  }
  private get __config() {
    return this.config
  }

  private set __status(v) {
    this.upStatus = this.status;
    this.setTop();
    switch (v) {
      case "initial":
        this.__Els.setInitial(this.upStatus)
        break;
      case "max":
        this.__Els.setMax(this.upStatus)
        break;
      case "mini":
        this.__Els.setMini();
        break;
      case "close":
        this.toClose();
        break;
    }
    this.status = v
  }

  private get __status() {
    return this.status
  }

  private set __zIndex(v) {
    this.__Els.box.style.zIndex = String(v)
    this.zIndex = v
  }

  private get __zIndex() {
    return this.zIndex
  }
  /**
   * 初始化显示窗口
   */
  private __init__show() {
    if (this.config.parentId) {
      const parentWin = Win.WinIdMap[this.config.parentId];
      if (!parentWin) {
        return console.error("没有找到上级窗口！")
      }
      parentWin.__Els.content.appendChild(this.__Els.box)
      parentWin.children[this.id] = this;
    } else {
      Win.defaultContentBox.appendChild(this.__Els.box)
    }
    this.__Els.setPosition(this.__config)
    Win.WinIdMap[this.id] = this
    // 下一帧，触发生命周期函数
    requestAnimationFrame(() => {
      if (this.callbacks.mounted) {
        this.callbacks.mounted(this)
      }
    })
  }
  /**
   * 添加移动事件
   */
  private addMoveEvent() {
    moveWin(this, () => {
      // 下一帧，触发生命周期函数
      requestAnimationFrame(() => {
        if (this.callbacks.move) {
          this.callbacks.move(this)
        }
      })
    })
  }
  /**
   * 添加按钮事件
   */
  private addButtonEvent() {
    this.__Els.minimize.addEventListener("click", () => {
      this.setMini()
    })
    this.__Els.maximize.addEventListener("click", () => {
      this.setMax()
    })
    this.__Els.close.addEventListener("click", () => {
      this.close()
    })
  }



  /**
   * 关闭窗口
   */
  private toClose() {
    // 判断是否存在子窗口 
    const childrenIds = Object.keys(this.children)
    // 如果存在子窗口,递归删除子窗口
    if (childrenIds.length) {
      // 递归释放内部窗口内存
      for (const key of childrenIds) {
        if (this.children[key]) {
          this.children[key].toClose()
        }
      }
    }

    // 先将元素从页面移除
    const parentElement = this.__Els.box.parentElement;
    if (parentElement) {
      parentElement.removeChild(this.__Els.box)
    }
    // 释放引用内存
    delete Win.WinIdMap[this.id]
    // 如果有父级窗口，也从父级窗口下解除引用
    if (this.__config.parentId) {
      delete Win.WinIdMap[this.__config.parentId].children[this.id]
    }
  }

  /**
   * 添加到最小化列表
   */
  private appendMiniList() {
    if (!Win.showMiniList) { return }
    // 找到父级
    let parentNode: HTMLElement, parentMiniEl: HTMLElement;
    if (this.__config.parentId && Win.WinIdMap[this.__config.parentId]) {
      parentNode = Win.WinIdMap[this.__config.parentId].__Els.content;
      parentMiniEl = Win.WinIdMap[this.__config.parentId].__Els.miniEl;
    } else {
      parentNode = Win.defaultContentBox;
      parentMiniEl = Win.baseMiniEl;
    }
    if (this.__status === "mini") {
      parentMiniEl.appendChild(this.__Els.box);
    } else {
      parentNode.appendChild(this.__Els.box);
    }
  }

  /**
   * 窗口置顶
   */
  setTop() {
    requestAnimationFrame(() => {
      if (!this.__zIndex || this.__zIndex < Win.zIndex) {
        Win.zIndex += 1;
        this.__zIndex = Win.zIndex;
        if (this.callbacks.top) {
          this.callbacks.top(this)
        }
      }
    })
  }
  /**
   * 设置窗口最大化
   */
  setMax() {
    if (this.__status === "max") {
      this.__status = "initial"
    } else {
      this.__status = "max"
    }
    // 下一帧触发回调
    requestAnimationFrame(() => {
      if (this.callbacks.max) {
        this.callbacks.max(this)
      }
    })
    return this
  }
  /**
   * 设置窗口最小化
   */
  setMini() {
    if (this.__status === "mini") {
      this.__status = this.upStatus;
    } else {
      this.__status = "mini";
    }
    this.appendMiniList();
    // 下一帧触发回调
    requestAnimationFrame(() => {
      if (this.callbacks.mini) {
        this.callbacks.mini(this)
      }
    })
    return this
  }
  /**
   * 关闭窗口
   */
  close() {
    this.__status = "close";
    // 下一帧触发回调
    requestAnimationFrame(() => {
      if (this.callbacks.close) {
        this.callbacks.close()
      }
    })
  }

  /**
   * 窗口加载完成
   */
  onmounted(fn: Callback) {
    if (typeof fn === "function") {
      this.callbacks.mounted = fn
    }
    return this
  }
  /**
   * 监听窗口最小化
   */
  onmini(fn: Callback) {
    if (typeof fn === "function") {
      this.callbacks.mini = fn
    }
    return this
  }
  /**
   * 监听窗口最大化
   */
  onmax(fn: Callback) {
    if (typeof fn === "function") {
      this.callbacks.max = fn
    }
    return this
  }
  /**
   * 监听窗口关闭
   */
  onclose(fn: () => void) {
    if (typeof fn === "function") {
      this.callbacks.close = fn
    }
    return this
  }
  /**
   * 监听窗口置顶
   */
  ontop(fn: Callback) {
    if (typeof fn === "function") {
      this.callbacks.top = fn
    }
    return this
  }
  /**
   * 监听窗口移动
   */
  onmove(fn: Callback) {
    if (typeof fn === "function") {
      this.callbacks.move = fn
    }
    return this
  }


  /**
   * 创建ID
   * @returns ID
   */
  static createId() {
    const random = "abcdefghijklmnopqrstuvwxyz"
    let rdStr = "";
    for (let i = 0; i < 8; i++) {
      rdStr += random[parseInt(String(Math.random() * random.length))]
    }
    return `new-dream-${rdStr}-${Date.now()}`
  }
}
function createBaseMiniEl() {
  const el = createElement("new-windows-mini-list-box");
  Win.defaultContentBox.appendChild(el);
  return el
}
export const $Win = Win