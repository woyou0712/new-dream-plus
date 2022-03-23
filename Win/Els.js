import svg from "../svg/index.js"
import "../css/win.css"
class Els {
  // 创建元素
  static createElement(eClass, eName = "div") {
    let el = document.createElement(eName)
    if (eClass) {
      if (typeof eClass === 'string') {
        el.className = eClass
      } else if (Array.isArray(eClass)) {
        el.classList.add(...eClass)
      }
    }
    return el
  }

  constructor() {
    this.box = Els.createElement(["new-windows-box", "initial"]); // 外层盒子
    this.header = Els.createElement("new-windows-header"); // 头部
    this.icon = Els.createElement("new-windows-icon"); // 图标
    this.title = Els.createElement("new-windows-title"); // 标题
    this.btnbox = Els.createElement("new-windows-btnbox"); // 右侧按钮盒子
    this.minimize = Els.createElement(["new-windows-btn", "new-windows-minimize"]); // 最小化 按钮
    this.maximize = Els.createElement(["new-windows-btn", "new-windows-maximize"]); // 最大化 按钮
    this.close = Els.createElement(["new-windows-btn", "new-windows-close"]); // 关闭 按钮
    this.content = Els.createElement("new-windows-content"); // 内容区域
    this.__setAttribute();
  }

  __setAttribute() {
    // 点击标题和按钮不做处理
    this.title.addEventListener("mousedown", (e) => {
      e.stopPropagation()
    })
    this.btnbox.addEventListener("mousedown", (e) => {
      e.stopPropagation()
    })
    // 装填图标
    this.minimize.innerHTML = svg.mini;
    this.maximize.innerHTML = svg.max;
    this.close.innerHTML = svg.close;
    // 装填标题
    this.header.appendChild(this.title)
    // 装填按钮盒子
    this.header.appendChild(this.btnbox)
    // 组装到盒子
    this.box.appendChild(this.header)
    this.box.appendChild(this.content)
    // 设置按钮
    this.btnbox.appendChild(this.minimize)  // 最小化
    this.btnbox.appendChild(this.maximize) // 最大化
    this.btnbox.appendChild(this.close) // 关闭按钮
  }
  // 设置属性
  setAttribute(icon, title, miniBtn, maxBtn, resize) {
    this.box.style['resize'] = resize ? 'both' : 'initial';
    // 设置标题
    if (icon) {
      this.icon.innerHTML = icon;
      this.title.appendChild(this.icon);
      let text = Els.createElement("new-windows-title-text", "span");
      text.innerText = title;
      this.title.appendChild(text);
    } else {
      this.title.innerText = title;
    }
    if (!miniBtn) { this.minimize.style["display"] = "none" }
    if (!maxBtn) { this.maximize.style["display"] = "none" }
  }
  // 设置大小
  setSize(width, height) {
    if (!isNaN(width)) {
      width = `${width}px`
    }
    if (!isNaN(height)) {
      height = `${height}px`
    }
    let reg = /^\d+px$/;
    if (reg.test(width)) { this.box.style["width"] = width }
    if (reg.test(height)) { this.box.style["height"] = height }
  }
  // 设置最大化图标
  setMaxIcon() {
    if (this.box.classList.contains("max") || this.box.classList.contains("mini")) {
      this.maximize.innerHTML = svg.unmax
    } else {
      this.maximize.innerHTML = svg.max
    }
  }
  // 计算初始位置
  initPosition(width, height, parentNode) {
    let top = null, left = null;
    // 如果父节点存在
    if (parentNode) {
      this.box.style['position'] = 'absolute';
      top = (parentNode.els.content.offsetHeight - height) / 2;
      left = (parentNode.els.content.offsetWidth - width) / 2;
    } else {
      this.box.style['position'] = 'fixed';
      top = (window.innerHeight - height) / 2
      left = (window.innerWidth - width) / 2
    }
    if (top < 0) {
      top = 0
    }
    if (left < 0) {
      left = 0
    }
    this.box.style['top'] = `${top}px`;
    this.box.style['left'] = `${left}px`;
  }
  // 设置默认值
  setInitial() {
    this.box.classList.add("initial")
    this.box.classList.remove("mini")
    this.box.classList.remove("max")
  }
  // 设置最大化
  setMax() {
    this.box.classList.add("max")
    this.box.classList.remove("initial")
    this.box.classList.remove("mini")
    this.setMaxIcon()
  }
  // 设置最小化
  setMini() {
    this.box.classList.add("mini")
    this.box.classList.remove("initial")
    this.box.classList.remove("max")
  }
}

export default Els