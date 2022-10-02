import { Win } from "..";

export default function (win: Win, endCallback: () => void) {
    // 鼠标按下
    win.__Els.move.addEventListener("mousedown", (move) => {
        win.setTop()
        if (win.status === "max") {
            console.warn("最大化窗口无法移动")
            return
        }
        const tW = win.__Els.title.offsetWidth;
        const hX = move.offsetX + tW, hY = move.offsetY;
        if (win.__Els.box.parentNode === document.body) {
            Win.Shade.style["position"] = "fixed"
        } else {
            Win.Shade.style["position"] = "absolute"
        }
        if (win.__Els.box.parentNode) {
            win.__Els.box.parentNode.appendChild(Win.Shade)
        }
        Win.Shade.onmousemove = (shade) => {
            const sX = shade.offsetX, sY = shade.offsetY;
            let left = sX - hX, top = sY - hY;
            if (top < 0) {
                top = 0
            }
            if (left < 0) {
                left = 0
            }
            win.__Els.box.style["left"] = `${left}px`;
            win.__Els.box.style["top"] = `${top}px`;
        }
    })
    // 鼠标抬起,移动结束
    Win.Shade.addEventListener("mouseup", () => {
        // 去除遮罩层
        const parentNode = Win.Shade.parentNode;
        if (parentNode) {
            parentNode.removeChild(Win.Shade)
        }
        // 清空移动事件
        Win.Shade.onmousemove = null
        // 调用结束回调函数
        endCallback()
    })
}