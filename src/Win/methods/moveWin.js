import { Win } from "..";
export default function (win, endCallback) {
    win.__Els.move.addEventListener("mousedown", function (move) {
        win.setTop();
        if (win.status === "max") {
            console.warn("最大化窗口无法移动");
            return;
        }
        var tW = win.__Els.title.offsetWidth;
        var hX = move.offsetX + tW, hY = move.offsetY;
        if (win.__Els.box.parentNode === document.body) {
            Win.Shade.style["position"] = "fixed";
        }
        else {
            Win.Shade.style["position"] = "absolute";
        }
        if (win.__Els.box.parentNode) {
            win.__Els.box.parentNode.appendChild(Win.Shade);
        }
        Win.Shade.onmousemove = function (shade) {
            var sX = shade.offsetX, sY = shade.offsetY;
            var left = sX - hX, top = sY - hY;
            if (top < 0) {
                top = 0;
            }
            if (left < 0) {
                left = 0;
            }
            win.__Els.box.style["left"] = "".concat(left, "px");
            win.__Els.box.style["top"] = "".concat(top, "px");
        };
    });
    Win.Shade.addEventListener("mouseup", function () {
        var parentNode = Win.Shade.parentNode;
        if (parentNode) {
            parentNode.removeChild(Win.Shade);
        }
        Win.Shade.onmousemove = null;
        endCallback();
    });
}
