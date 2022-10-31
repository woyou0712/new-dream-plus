import createElement from "../utils/createElement";
import html2canvasMin from "html2canvas";
import { closeSvg, successSvg } from "../svg/button";
var Screen = (function () {
    function Screen() {
        this.methods = {};
        this.box = createElement("new-screen-box");
        this.bgImg = createElement({ name: "img", class: "new-screen-bg-img" });
        this.top = createElement("new-screen-top");
        this.center = createElement("new-screen-center");
        this.left = createElement("new-screen-left");
        this.content = createElement("new-screen-content");
        this.contentImg = createElement({ name: "img", class: "new-screen-content-img" });
        this.right = createElement("new-screen-right");
        this.bottom = createElement("new-screen-bottom");
        this.shade = createElement("new-screen-shade");
        this.btns = createElement("new-screen-btns");
        this.closeBtn = createElement("new-screen-close-btn");
        this.submitBtn = createElement("new-screen-submit-btn");
        this.__init_box();
        this.__init_event();
    }
    Screen.prototype.__init_box = function () {
        this.center.appendChild(this.left);
        this.center.appendChild(this.content);
        this.center.appendChild(this.right);
        this.box.appendChild(this.bgImg);
        this.box.appendChild(this.top);
        this.box.appendChild(this.center);
        this.box.appendChild(this.bottom);
        this.box.appendChild(this.shade);
        this.closeBtn.innerHTML = closeSvg;
        this.submitBtn.innerHTML = successSvg;
        var text = createElement({ name: "span" });
        text.innerText = "完成";
        this.submitBtn.appendChild(text);
        this.btns.append(this.closeBtn);
        this.btns.append(this.submitBtn);
    };
    Screen.prototype.__init_event = function () {
        var _this = this;
        var endX = 0, endY = 0;
        this.shade.addEventListener("mousedown", function (event) {
            var e = event;
            var startX = e.layerX, startY = e.layerY;
            _this.top.style["height"] = "".concat(startY, "px");
            _this.left.style["width"] = "".concat(startX, "px");
            _this.reset();
            endX = 0;
            endY = 0;
            _this.shade.onmousemove = function (event) {
                var e = event;
                endX = e.layerX;
                endY = e.layerY;
                if (endX < startX || endY < startY) {
                    return;
                }
                var height = "".concat(endY - startY, "px");
                _this.left.style["height"] = _this.content.style["height"] = _this.right.style["height"] = height;
                _this.content.style["width"] = "".concat(endX - startX, "px");
                _this.content.appendChild(_this.contentImg);
                _this.contentImg.style["top"] = "-".concat(startY, "px");
                _this.contentImg.style["left"] = "-".concat(startX, "px");
            };
        });
        this.shade.addEventListener("mouseup", function () {
            _this.shade.onmousemove = null;
            if (endX && endY) {
                _this.btns.style["top"] = "".concat(endY + 5, "px");
                _this.btns.style["left"] = "".concat(endX - 110, "px");
                _this.box.appendChild(_this.btns);
            }
        });
        this.shade.setAttribute("tabindex", "1");
        this.shade.addEventListener("keydown", function (e) {
            if (e.key != "Escape") {
                return;
            }
            _this.close();
        });
        this.closeBtn.addEventListener("click", function () { _this.close(); });
        this.submitBtn.addEventListener("click", function () { _this.success(); });
    };
    Screen.prototype.reset = function () {
        this.content.style["width"] = "0";
        this.content.style["height"] = "0";
        this.content.innerHTML = "";
        var btnF = this.btns.parentNode;
        if (btnF) {
            btnF.removeChild(this.btns);
        }
    };
    Screen.prototype.start = function () {
        var _this = this;
        document.body.style["minHeight"] = "100vh";
        document.body.style["position"] = "relative";
        html2canvasMin(document.body, {
            useCORS: true,
            scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
            allowTaint: true,
        }).then(function (canvas) {
            var imagedata = canvas.toDataURL('image/jpeg', 1.0);
            _this.bgImg.setAttribute("src", imagedata);
            _this.contentImg.setAttribute("src", imagedata);
            document.body.appendChild(_this.box);
            _this.shade.focus();
        });
        return this;
    };
    Screen.prototype.remove = function () {
        var p = this.box.parentNode;
        if (p && p.nodeName) {
            p.removeChild(this.box);
            this.content.style["width"] = "0";
            this.content.style["height"] = "0";
        }
        this.reset();
    };
    Screen.prototype.close = function () {
        var _this = this;
        this.remove();
        requestAnimationFrame(function () {
            if (typeof _this.methods.close === "function") {
                _this.methods.close();
            }
        });
    };
    Screen.prototype.success = function () {
        var _this = this;
        html2canvasMin(this.content, {
            useCORS: true,
            scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
            allowTaint: true,
        }).then(function (canvas) {
            var imagedata = canvas.toDataURL('image/jpeg', 1.0);
            _this.remove();
            requestAnimationFrame(function () {
                if (typeof _this.methods.success === "function") {
                    _this.methods.success(imagedata);
                }
            });
        });
    };
    Screen.prototype.onsuccess = function (success) {
        this.methods.success = success;
        return this;
    };
    Screen.prototype.onclose = function (close) {
        this.methods.close = close;
        return this;
    };
    return Screen;
}());
export { Screen };
export var $Screen = Screen;
