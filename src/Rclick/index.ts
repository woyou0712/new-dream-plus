import { App, DirectiveBinding } from "vue";
import { dirSvg, disSvg, indSvg } from "../svg/button"
import createElement from "../utils/createElement"
import { MenuItem, MenuSattus } from "./menu.d"

export class Menu {
  private options: MenuItem[] = defaultMenus;
  private el: HTMLElement;
  private menu: HTMLElement;
  private status: MenuSattus = "none";
  private width = 220;
  private height = 6;
  private left = 0;
  private top = 0;

  constructor(el: HTMLElement, options: MenuItem[]) {
    this.el = el;
    if (!this.el || !this.el.nodeName) {
      throw "请指定需要右键弹窗的元素"
    }
    this.__options = options;
    this.menu = this.__create__menu(); // 创建菜单
    this.__set__event(); // 绑定事件
    this.el.appendChild(this.menu); // 将菜单挂载到页面

  }

  set __options(v) {
    if (!v || !Array.isArray(v) || !v.length) {
      v = defaultMenus
    }
    this.height = v.length * 30 + 6;
    this.options = v
  }

  get __options() {
    return this.options
  }

  set __left(v) {
    this.menu.style.left = `${v}px`
    this.left = v
  }

  get __left() {
    return this.left
  }
  set __top(v) {
    this.menu.style.top = `${v}px`
    this.top = v
  }

  get __top() {
    return this.top
  }
  set __status(v) {
    this.menu.style.display = v;
    this.status = v
  }

  get __status() {
    return this.status
  }


  private __create__menu() {
    // 创建菜单盒子
    const menuBox = createElement("windows-right-menus");
    menuBox.style.display = this.__status; // 初始化状态
    menuBox.style.width = `${this.width}px`; // 设置宽度
    // 创建菜单
    const menus: HTMLElement[] = [];
    this.__options.forEach(item => {
      const menu = createElement("window-right-menus-item");
      menu.addEventListener("click", () => {
        item.method(item.id);
      })
      const icon = createElement("window-right-menus-item-icon");
      if (typeof item.icon === "string") {
        icon.innerHTML = item.icon
      } else if (item.icon && item.icon.nodeName) {
        icon.appendChild(item.icon)
      }

      const name = createElement("window-right-menus-item-name");
      name.innerText = item.name;

      menu.appendChild(icon)
      menu.appendChild(name)

      menus.push(menu)
    })
    menus.forEach(menu => {
      menuBox.appendChild(menu)
    })
    return menuBox;
  }

  private __set__event() {
    // 右键点击弹出菜单
    this.el.addEventListener("contextmenu", (e) => {
      e.stopPropagation();//停止冒泡
      e.preventDefault();//阻止默认事件
      const vw = window.innerWidth, vh = window.innerHeight;
      let left = e.pageX, top = e.pageY;
      if (vw - left < this.width) {
        left = vw - this.width
      }
      if (vh - top < this.height) {
        top = vh - this.height
      }
      this.__left = left;
      this.__top = top;
      this.__status = "block"
    })
    // 左键点击关闭菜单
    this.el.addEventListener("click", () => {
      this.__status = "none"
    })
    // 为元素添加可获取焦点属性
    this.el.setAttribute("tabindex", "1")
    // 失去焦点关闭菜单
    this.el.addEventListener("blur", () => {
      this.__status = "none"
    })
  }
}

export function installMenu(app: App<Element>) {
  app.directive("Rclick", {
    mounted(el: HTMLElement, options: DirectiveBinding<MenuItem[]>) {
      new Menu(el, options.value)
    }
  });
}

export const $Menu = Menu


const defaultMenus: MenuItem[] = [
  {
    id: 0,
    icon: dirSvg,
    name: "新建文件夹",
    method: function () {
      console.log("你点击了【新建文件夹】")
    }
  },
  {
    id: 1,
    name: "查看(V)",
    method: function () {
      console.log("你点击了【查看】")
    }
  },
  {
    id: 2,
    name: "排序方式(O)",
    method: function () {
      console.log("你点击了【排序方式】")
    }
  },
  {
    id: 3,
    name: "刷新",
    method: function () {
      console.log("你点击了【刷新】")
    }
  },
  {
    id: 4,
    icon: disSvg,
    name: "显示设置",
    method: function () {
      console.log("你点击了【显示设置】")
    }
  },
  {
    id: 4,
    icon: indSvg,
    name: "个性化",
    method: function () {
      console.log("你点击了【个性化】")
    }
  },
]


