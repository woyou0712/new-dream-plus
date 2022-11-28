import { App, DirectiveBinding } from "vue";
import { dirSvg, disSvg, indSvg } from "../svg/button"
import createElement from "../utils/createElement"
import { MenuItem } from "./menu.d"

export class Menu {
  /** 配置项 */
  private options: MenuItem[] = defaultMenus;
  /** 要绑定右键菜单的元素列表 */
  private els: HTMLElement[];
  /** 右键菜单元素 */
  private menu: HTMLElement;
  /** 菜单宽 */
  private width = 220;
  /** 菜单高 */
  private height = 6;
  /** 菜单坐标X */
  private left = 0;
  /** 菜单坐标Y */
  private top = 0;
  /** 触发右键菜单的元素 */
  private el?: HTMLElement;

  constructor(el: HTMLElement | HTMLElement[], options: MenuItem[]) {
    if (Array.isArray(el)) {
      let parentElement: HTMLElement | null = null;
      el.forEach(e => {
        if (parentElement && e.parentElement !== parentElement) {
          throw "多个元素必须是兄弟关系"
        } else {
          parentElement = e.parentElement
        }
      })
      this.els = el;
    } else {
      this.els = [el]
    }
    this.__options = options;
    this.menu = this.__create__menu(); // 创建菜单
    this.__set__event(); // 绑定事件
  }

  private set __options(v) {
    if (!v || !Array.isArray(v) || !v.length) {
      v = defaultMenus
    }
    this.height = v.length * 30 + 6;
    this.options = v
  }

  private get __options() {
    return this.options
  }

  private set __left(v) {
    this.menu.style.left = `${v}px`
    this.left = v
  }

  private get __left() {
    return this.left
  }
  private set __top(v) {
    this.menu.style.top = `${v}px`
    this.top = v
  }

  private get __top() {
    return this.top
  }


  private __create__menu() {
    // 创建菜单盒子
    const menuBox = createElement("windows-right-menus");
    menuBox.style.width = `${this.width}px`; // 设置宽度
    // 创建菜单
    const menus: HTMLElement[] = [];
    this.__options.forEach(item => {
      const menu = createElement("window-right-menus-item");
      menu.addEventListener("click", () => {
        item.method(this.el);
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
    // 鼠标按下=》停止冒泡
    this.menu.onmousedown = (e) => {
      e.stopPropagation();//停止冒泡
      e.preventDefault();//阻止默认事件
    }
    // 右键点击弹出菜单
    this.els.forEach(el => {
      el.oncontextmenu = (e) => {
        e.stopPropagation();//停止冒泡
        e.preventDefault();//阻止默认事件
        this.el = el;
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
        if (this.els.length > 1) {
          // 如果传入的是多个元素，则绑定在父元素身上
          const parentElement = el.parentElement;
          if (parentElement) {
            parentElement.appendChild(this.menu);
            // 左键点击关闭菜单
            parentElement.onclick = () => { this.closeMenu() }
            // 为元素添加可获取焦点属性
            parentElement.setAttribute("tabindex", "1")
            // 失去焦点关闭菜单
            parentElement.onblur = () => { this.closeMenu() }
          }
        } else {
          el.appendChild(this.menu)
          // 左键点击关闭菜单
          el.onclick = () => { this.closeMenu() }
          // 为元素添加可获取焦点属性
          el.setAttribute("tabindex", "1")
          // 失去焦点关闭菜单
          el.onblur = () => { this.closeMenu() }
        }
      }
    })


  }

  private closeMenu() {
    const parentElement = this.menu.parentElement;
    if (parentElement) {
      parentElement.removeChild(this.menu)
    }
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


