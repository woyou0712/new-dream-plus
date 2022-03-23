import { createApp } from "vue"
import Els from "./Els.js"

function createShade() {
  let shade = document.createElement("div")
  shade.setAttribute("id", "new-windows-shade")
  return shade
}

const defaultConfig = {
  title: "新窗口",
  status: "initial",
  url: "http://www.bauble.vip",
  width: "800px",
  height: "600px",
  miniBtn: true,
  maxBtn: true,
  resize: true,
  icon: null,
}

class Win {
  static allMap = {}; // 所有窗口map表
  static shade = createShade(); // 拖拽遮罩层,防止元素丢失/卡顿
  static config = defaultConfig; // 配置项缺省值
  static zIndex = 0; // 层级

  constructor(config = Win.config) {
    // 监听方法
    this.__methods = {}
    // 加载初始化配置项
    this.__initConfig(config)
    // 初始化元素
    this.__initEls()
    // 挂载内容
    this.__addContent(config);
    // 设置层级
    this.__setZindex();
    // 渲染
    this.__showWin();

  }
  // 初始化配置属性
  __initConfig(config) {
    this.id = config.id || `new-windows-box-${Math.random()}-${Date.now()}`; // 窗口ID
    // 如果窗口ID重复,则直接置顶显示
    if (Win.allMap[this.id]) {
      Win.allMap[this.id].__status = 'initial'
      this.__setZindex()
      return
    }
    Win.allMap[this.id] = this
    this.parentId = config.parentId; // 父窗口ID
    if (this.parentId && Win.allMap[this.parentId]) {
      Win.allMap[this.parentId].children[this.id] = this
    } else {
      this.parentId = null
    }
    this.status = config.status || Win.config.status;  // initial:默认显示 ,max:最大化, mini:最小化, close:关闭/隐藏 ---
    this.icon = config.icon || Win.config.icon; // 窗口图标
    this.title = config.title || Win.config.title; // 窗口标题
    this.width = config.width || Win.config.width; // 窗口宽
    this.height = config.height || Win.config.height; // 窗口高
    this.miniBtn = config.miniBtn || config.miniBtn === false ? config.miniBtn : Win.config.miniBtn; // 显示最小化按钮
    this.resize = config.resize || config.resize === false ? config.resize : Win.config.resize; // 窗口是否可以缩放
    this.maxBtn = config.maxBtn || config.maxBtn === false ? config.maxBtn : Win.config.maxBtn; // 显示最大化按钮
    this.children = {}
  }

  set __status(v) {
    if (!this.els || !this.els.box) {
      return
    }
    if (["initial", "max", "mini", "close"].indexOf(v) === -1) {
      return console.error("status is not legitimacy")
    }
    this.status = v;
    switch (v) {
      case 'initial':
        this.els.setInitial()
        break;
      case "max":
        this.els.setMax()
        break
      case "mini":
        this.els.setMini()
        break
      case "close":
        this.__setClose()
        break
    }
  }
  get __status() {
    return this.status;
  }
  // 创建基本元素
  __initEls() {
    this.els = new Els();
    this.els.setSize(this.width, this.height); // 设置窗口大小
    let parentNode = this.parentId ? Win.allMap[this.parentId] : null;
    this.els.initPosition(parseFloat(this.width), parseFloat(this.height), parentNode); // 初始化显示区域
    this.els.setAttribute(this.icon, this.title, this.miniBtn, this.maxBtn, this.resize); // 设置属性
    this.__setClick() // 添加点击事件
    this.__setDrag() // 添加拖拽方法
  }
  // 加载内容
  __addContent(config) {
    // 挂载内容 如果是VUE组件
    if (config.component) {
      this.component = createApp(config.component, config.props || {}); // 解析渲染VUE组件
      this.component.mount(this.els.content)
    } else {
      let html = Els.createElement("new-windows-html", "iframe")
      html.sandbox = "allow-forms allow-scripts allow-same-origin allow-popups"; //防止域名重定向,导致整个页面跳转
      html.setAttribute("src", config.url || Win.config.url)
      this.els.content.appendChild(html)
    }
  }

  // 渲染到页面
  __showWin() {
    // 在浏览器下一次更新帧时渲染
    requestAnimationFrame(() => {
      if (this.parentId && Win.allMap[this.parentId] && Win.allMap[this.parentId].els) {
        Win.allMap[this.parentId].els.content.appendChild(this.els.box)
      } else {
        document.body.appendChild(this.els.box)
      }
      this.__onmounted()
    })
  }

  // 设置层级
  __setZindex() {
    // 在浏览器下一次更新帧时渲染
    requestAnimationFrame(() => {
      Win.zIndex += 1;
      this.els.box.style["z-index"] = Win.zIndex
      this.zIndex = Win.zIndex
      this.__ontop()
    })
  }

  // 设置事件监听方法
  __setClick() {
    // 盒子点击置顶
    this.els.box.addEventListener("click", (e) => {
      this.__setZindex()
    })
    // 最小化图标点击
    this.els.minimize.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.els.box.classList.contains("mini")) { return }
      this.__status = "mini"
      this.__onmini()
    })
    // 最大化图标点击
    this.els.maximize.addEventListener("click", (e) => {
      this.__status = ["max", "mini"].indexOf(this.status) !== -1 ? "initial" : "max";
      this.els.setMaxIcon()
      this.__onmax()
    })
    // 关闭图标
    this.els.close.addEventListener("click", (e) => {
      e.stopPropagation();
      this.__status = "close"
      this.__onclose()
    })
  }
  // 拖拽方法
  __setDrag() {
    // 鼠标按下
    this.els.header.addEventListener("mousedown", (head) => {
      this.__setZindex()
      let hX = head.offsetX, hY = head.offsetY;
      if (this.els.box.parentNode === document.body) {
        Win.shade.style["position"] = "fixed"
      } else {
        Win.shade.style["position"] = "absolute"
      }
      this.els.box.parentNode.appendChild(Win.shade)
      Win.shade.onmousemove = (shade) => {
        let sX = shade.offsetX, sY = shade.offsetY;
        let left = sX - hX, top = sY - hY;
        if (top < 0) {
          top = 0
        }
        this.els.box.style["left"] = `${left}px`;
        this.els.box.style["top"] = `${top}px`;
      }
    })
    // 鼠标抬起
    Win.shade.addEventListener("mouseup", (e) => {
      let f = Win.shade.parentNode;
      if (f) {
        f.removeChild(Win.shade)
      }
      Win.shade.onmousemove = null
    })
  }
  // 关闭方法
  __setClose() {
    // 如果存在内部窗口 
    let childrenIds = Object.keys(this.children)
    if (childrenIds.length) {
      // 递归释放内部窗口内存
      for (let key of childrenIds) {
        if (this.children[key]) {
          this.children[key].__setClose()
        }
      }
    }
    // 清除当前窗口
    let p = this.els.box.parentNode;
    if (p) {
      p.removeChild(this.els.box)
    }
    // 释放本窗口内存
    Win.allMap[this.id] = null;
    if (this.parentId && Win.allMap[this.parentId]) {
      Win.allMap[this.parentId].children[this.id] = null
    }
  }

  /**
   * ****************************************用户方法*******************************************
   */

  __onmounted() {
    if (typeof this.__methods.__onmounted === "function") {
      this.__methods.__onmounted(this)
    }
  }
  // 组件渲染之后调用
  onmounted(fn = () => { }) {
    if (typeof fn === "function") {
      this.__methods.__onmounted = fn
    }
    return this
  }
  __onmini() {
    if (typeof this.__methods.__onmini === "function") {
      this.__methods.__onmini(this)
    }
  }
  // 组件最小化调用
  onmini(fn = () => { }) {
    if (typeof fn === "function") {
      this.__methods.__onmini = fn
    }
    return this
  }
  __onmax() {
    if (typeof this.__methods.__onmax === "function") {
      this.__methods.__onmax(this)
    }
  }
  // 组件最大化调用
  onmax(fn = () => { }) {
    if (typeof fn === "function") {
      this.__methods.__onmax = fn
    }
    return this
  }
  // 关闭组件
  close() {
    this.__status = "close"
    this.__onclose()
  }
  __onclose() {
    if (typeof this.__methods.__onclose === "function") {
      this.__methods.__onclose(this)
    }
  }
  // 组件关闭后调用
  onclose(fn = () => { }) {
    if (typeof fn === "function") {
      this.__methods.__onclose = fn
    }
    return this
  }
  __ontop() {
    if (typeof this.__methods.__ontop === "function") {
      this.__methods.__ontop(this)
    }
  }
  // 组件置顶调用
  ontop(fn = () => { }) {
    if (typeof fn === "function") {
      this.__methods.__ontop = fn
    }
    return this
  }

}


export default Win
