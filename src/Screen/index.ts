import createElement from "../utils/createElement";
import html2canvasMin from "html2canvas";
import { closeSvg, successSvg } from "../svg/button";
type Callback = (imagedata?: string) => void
type Methods = {
  close?: Callback
  success?: Callback
}

interface MyMouseEvent extends MouseEvent {
  layerX: number
  layerY: number
}


export class Screen {
  private box: HTMLElement
  private bgImg: HTMLElement
  private top: HTMLElement
  private center: HTMLElement
  private left: HTMLElement
  private content: HTMLElement
  private contentImg: HTMLElement
  private right: HTMLElement
  private bottom: HTMLElement
  private shade: HTMLElement
  private btns: HTMLElement
  private closeBtn: HTMLElement
  private submitBtn: HTMLElement
  private methods: Methods = {}
  constructor() {
    this.box = createElement("new-screen-box");
    this.bgImg = createElement({ name: "img", class: "new-screen-bg-img" });
    this.top = createElement("new-screen-top");
    this.center = createElement("new-screen-center");
    this.left = createElement("new-screen-left");
    this.content = createElement("new-screen-content");
    this.contentImg = createElement({ name: "img", class: "new-screen-content-img" })
    this.right = createElement("new-screen-right");
    this.bottom = createElement("new-screen-bottom");
    this.shade = createElement("new-screen-shade");
    this.btns = createElement("new-screen-btns");
    this.closeBtn = createElement("new-screen-close-btn");
    this.submitBtn = createElement("new-screen-submit-btn");
    this.__init_box();
    this.__init_event();
  }

  private __init_box() {
    this.center.appendChild(this.left);
    this.center.appendChild(this.content);
    this.center.appendChild(this.right);

    this.box.appendChild(this.bgImg);
    this.box.appendChild(this.top);
    this.box.appendChild(this.center);
    this.box.appendChild(this.bottom);
    this.box.appendChild(this.shade);
    // 按钮
    this.closeBtn.innerHTML = closeSvg;
    this.submitBtn.innerHTML = successSvg;
    const text = createElement({ name: "span" });
    text.innerText = "完成";
    this.submitBtn.appendChild(text);
    this.btns.append(this.closeBtn);
    this.btns.append(this.submitBtn);
  }



  private __init_event() {
    let endX = 0, endY = 0;
    // 监听鼠标按下
    this.shade.addEventListener("mousedown", (e: MyMouseEvent) => {
      const startX = e.layerX, startY = e.layerY;
      this.top.style["height"] = `${startY}px`;
      this.left.style["width"] = `${startX}px`;
      // 重置属性
      this.reset();
      endX = 0;
      endY = 0;
      // 监听鼠标移动
      this.shade.onmousemove = (e: MyMouseEvent) => {
        endX = e.layerX;
        endY = e.layerY;
        if (endX < startX || endY < startY) {
          return;
        }
        const height = `${endY - startY}px`;
        this.left.style["height"] = this.content.style["height"] = this.right.style["height"] = height;
        this.content.style["width"] = `${endX - startX}px`;
        this.content.appendChild(this.contentImg);
        this.contentImg.style["top"] = `-${startY}px`;
        this.contentImg.style["left"] = `-${startX}px`;
      }
    })
    // 监听鼠标抬起
    this.shade.addEventListener("mouseup", () => {
      this.shade.onmousemove = null;
      if (endX && endY) {
        this.btns.style["top"] = `${endY + 5}px`
        this.btns.style["left"] = `${endX - 110}px`
        this.box.appendChild(this.btns);
      }
    })
    this.shade.setAttribute("tabindex", "1"); // 允许获取焦点
    // 监听ESC按键
    this.shade.addEventListener("keydown", (e) => {
      if (e.key != "Escape") {
        return
      }
      this.close()
    })

    // 点击取消
    this.closeBtn.addEventListener("click", () => { this.close() })
    // 点击确定
    this.submitBtn.addEventListener("click", () => { this.success() })
  }
  private reset() {
    this.content.style["width"] = "0";
    this.content.style["height"] = "0";
    this.content.innerHTML = "";
    const btnF = this.btns.parentNode
    if (btnF) {
      btnF.removeChild(this.btns)
    }
  }

  start() {
    document.body.style["minHeight"] = "100vh"
    document.body.style["position"] = "relative"
    html2canvasMin(document.body, {
      useCORS: true, // 【重要】开启跨域配置
      scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
      allowTaint: true, // 允许跨域图片
    }).then((canvas: HTMLCanvasElement) => {
      const imagedata = canvas.toDataURL('image/jpeg', 1.0);
      this.bgImg.setAttribute("src", imagedata);
      this.contentImg.setAttribute("src", imagedata);
      document.body.appendChild(this.box);
      this.shade.focus();
    })
    return this
  }

  private remove() {
    const p = this.box.parentNode;
    if (p && p.nodeName) {
      p.removeChild(this.box)
      this.content.style["width"] = "0";
      this.content.style["height"] = "0";
    }
    this.reset()
  }
  private close() {
    this.remove();
    requestAnimationFrame(() => {
      if (typeof this.methods.close === "function") {
        this.methods.close()
      }
    })
  }

  private success() {
    html2canvasMin(this.content, {
      useCORS: true, // 【重要】开启跨域配置
      scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
      allowTaint: true, // 允许跨域图片
    }).then((canvas: HTMLCanvasElement) => {
      const imagedata = canvas.toDataURL('image/jpeg', 1.0);
      this.remove();
      requestAnimationFrame(() => {
        if (typeof this.methods.success === "function") {
          this.methods.success(imagedata)
        }
      })
    })

  }

  onsuccess(success: Callback) {
    this.methods.success = success
    return this
  }

  onclose(close: Callback) {
    this.methods.close = close
    return this
  }

}

export const $Screen = Screen