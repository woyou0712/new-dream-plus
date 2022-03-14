import Menu from "./Menu.js"
export default {
  // 当前绑定的元素挂载到DOM中时
  mounted(el, option) {
    if (option && !Array.isArray(option) && Array.isArray(option.value)) {
      option = option.value
    }
    // 添加右键事件
    el.addEventListener("contextmenu", (e) => {
      e.stopPropagation();//停止冒泡
      e.preventDefault();//阻止默认事件
      let m = new Menu(option, el); // 新建菜单
      let width = 236, height = m.option.length * 30 + 6;
      let vw = window.innerWidth, vh = window.innerHeight;
      let left = e.pageX, top = e.pageY;
      if (vw - left < width) {
        left = vw - width
      }
      if (vh - top < height) {
        top = vh - height
      }
      Menu.setAddr(`${left}px`, `${top}px`)
      document.body.appendChild(Menu.el); // 渲染菜单
    })
    // 左键点击事件
    el.addEventListener("click", () => {
      Menu.remove()
    })
  }

}