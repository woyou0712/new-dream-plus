import createElement from "../utils/createElement";
import { closeSvg, maxSvg, unmaxSvg, miniSvg } from "../svg/button";
import { Win } from ".";
import { createApp } from "vue";
var WinEl = (function () {
    function WinEl(config) {
        this.box = createElement(["new-windows-box", "initial"]);
        this.header = createElement("new-windows-header");
        this.title = createElement("new-windows-title");
        this.icon = createElement("new-windows-icon");
        this.name = createElement("new-windows-name");
        this.move = createElement("new-windows-move");
        this.btnbox = createElement("new-windows-btnbox");
        this.minimize = createElement(["new-windows-btn", "new-windows-minimize"]);
        this.maximize = createElement(["new-windows-btn", "new-windows-maximize"]);
        this.close = createElement(["new-windows-btn", "new-windows-close"]);
        this.content = createElement("new-windows-content");
        this.miniEl = createElement("new-windows-mini-list-box");
        this.__init__attribute__content(config);
        this.__init__correlation();
    }
    WinEl.prototype.__init__attribute__content = function (config) {
        this.minimize.innerHTML = miniSvg;
        this.maximize.innerHTML = maxSvg;
        this.close.innerHTML = closeSvg;
        if (typeof config.icon === "string") {
            this.icon.innerHTML = config.icon;
        }
        else if (config.icon) {
            this.icon.appendChild(config.icon);
        }
        if (config.title) {
            this.name.innerText = config.title;
        }
        if (!config.miniBtn) {
            this.minimize.style.display = "none";
        }
        if (!config.maxBtn) {
            this.maximize.style.display = "none";
        }
        if (config.resize) {
            this.box.style.resize = "both";
        }
        if (config.width) {
            this.box.style.width = config.width;
        }
        if (config.height) {
            this.box.style.height = config.height;
        }
        var _a = this.__init__position(config), top = _a.top, left = _a.left;
        this.box.style.top = "".concat(top, "px");
        this.box.style.left = "".concat(left, "px");
        this.__set_content(config);
    };
    WinEl.prototype.__init__correlation = function () {
        this.title.appendChild(this.icon);
        this.title.appendChild(this.name);
        this.btnbox.appendChild(this.minimize);
        this.btnbox.appendChild(this.maximize);
        this.btnbox.appendChild(this.close);
        this.header.appendChild(this.title);
        this.header.appendChild(this.move);
        this.header.appendChild(this.btnbox);
        this.box.appendChild(this.header);
        this.content.appendChild(this.miniEl);
        this.box.appendChild(this.content);
    };
    WinEl.prototype.__init__position = function (config) {
        var _a, _b;
        var top = 0, left = 0;
        var reg = /[^\d]/g;
        var width = (_a = config.width) === null || _a === void 0 ? void 0 : _a.replace(reg, ""), height = (_b = config.height) === null || _b === void 0 ? void 0 : _b.replace(reg, "");
        if (config.parentId && Win.WinIdMap[config.parentId]) {
            var parentWin = Win.WinIdMap[config.parentId];
            if (parentWin.__Els) {
                this.box.style['position'] = 'absolute';
                top = (parentWin.__Els.content.offsetHeight - Number(height)) / 2;
                left = (parentWin.__Els.content.offsetWidth - Number(width)) / 2;
                return { top: top < 0 ? 0 : top, left: left < 0 ? 0 : left };
            }
        }
        this.box.style['position'] = 'fixed';
        top = (window.innerHeight - Number(height)) / 2;
        left = (window.innerWidth - Number(width)) / 2;
        return { top: top < 0 ? 0 : top, left: left < 0 ? 0 : left };
    };
    WinEl.prototype.__set_content = function (config) {
        if (config.component) {
            var props = config.props ? config.props : {};
            var component = createApp(config.component, props);
            component.mount(this.content);
        }
        else if (config.url) {
            var iframe = createElement({ class: "new-windows-html", name: "iframe" });
            iframe.setAttribute("sandbox", "allow-downloads allow-forms allow-modals allow-orientation-lock allow-popups allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation");
            iframe.setAttribute("src", config.url);
            this.content.appendChild(iframe);
        }
    };
    WinEl.prototype.setInitial = function (upStatus) {
        this.box.classList.add("initial");
        this.box.classList.remove("mini");
        this.box.classList.remove("max");
        if (upStatus === "mini") {
            this.minimize.innerHTML = miniSvg;
        }
        else {
            this.maximize.innerHTML = maxSvg;
        }
    };
    WinEl.prototype.setMax = function (upStatus) {
        this.box.classList.add("max");
        this.box.classList.remove("initial");
        this.box.classList.remove("mini");
        this.maximize.innerHTML = unmaxSvg;
        if (upStatus === "mini") {
            this.minimize.innerHTML = miniSvg;
        }
    };
    WinEl.prototype.setMini = function () {
        this.box.classList.add("mini");
        this.box.classList.remove("initial");
        this.box.classList.remove("max");
        this.minimize.innerHTML = maxSvg;
    };
    return WinEl;
}());
export { WinEl };
