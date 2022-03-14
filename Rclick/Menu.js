import Els from "../Win/Els.js"
import "../css/rclick.css"
import defaultOption from "./defaultOption.js"
function cretaetMenuBox() {
  let el = Els.createElement("windows-right-menus");
  el.addEventListener("click", () => {
    Menu.remove()
  })
  return el
}

class Menu {
  static defaultOption = defaultOption;

  static el = cretaetMenuBox()

  static setAddr(left, top) {
    Menu.el.style["left"] = left
    Menu.el.style["top"] = top
  }
  static remove() {
    let f = Menu.el.parentElement;
    if (f) {
      f.removeChild(Menu.el)
    }
    Menu.el.innerHTML = ""; // 清空菜单
  }

  constructor(option, el) {
    Menu.remove(); // 先移除菜单
    if (option && Array.isArray(option)) {
      this.option = option
    } else {
      console.warn("Menu option is not Array")
      this.option = Menu.defaultOption
    }
    this.el = el
    this.__createItem()
  }

  __createItem() {
    for (let i = 0; i < this.option.length; i++) {
      let item = this.option[i]
      let eItem = Els.createElement("window-right-menus-item");

      eItem.addEventListener("click", () => {
        if (typeof item.fn == "function") {
          item.fn(this.el);
          return
        }
        console.warn(`${item.name}.fn is not function`)
      })
      let icon = Els.createElement("window-right-menus-item-icon");
      if (item.icon) {
        icon.innerHTML = item.icon
      }

      let name = Els.createElement("window-right-menus-item-name");

      name.innerText = item.name;
      eItem.appendChild(icon)
      eItem.appendChild(name)

      Menu.el.appendChild(eItem)
    }

  }
}


export default Menu