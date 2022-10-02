import { dirSvg, disSvg, indSvg } from "../svg/button";
import createElement from "../utils/createElement";
var Menu = (function () {
    function Menu(el, options) {
        this.options = defaultMenus;
        this.status = "none";
        this.width = 220;
        this.height = 6;
        this.left = 0;
        this.top = 0;
        this.el = el;
        if (!this.el || !this.el.nodeName) {
            throw "请指定需要右键弹窗的元素";
        }
        this.__options = options;
        this.menu = this.__create__menu();
        this.__set__event();
        this.el.appendChild(this.menu);
    }
    Object.defineProperty(Menu.prototype, "__options", {
        get: function () {
            return this.options;
        },
        set: function (v) {
            if (!v || !Array.isArray(v) || !v.length) {
                v = defaultMenus;
            }
            this.height = v.length * 30 + 6;
            this.options = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "__left", {
        get: function () {
            return this.left;
        },
        set: function (v) {
            this.menu.style.left = "".concat(v, "px");
            this.left = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "__top", {
        get: function () {
            return this.top;
        },
        set: function (v) {
            this.menu.style.top = "".concat(v, "px");
            this.top = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "__status", {
        get: function () {
            return this.status;
        },
        set: function (v) {
            this.menu.style.display = v;
            this.status = v;
        },
        enumerable: false,
        configurable: true
    });
    Menu.prototype.__create__menu = function () {
        var menuBox = createElement("windows-right-menus");
        menuBox.style.display = this.__status;
        menuBox.style.width = "".concat(this.width, "px");
        var menus = [];
        this.__options.forEach(function (item) {
            var menu = createElement("window-right-menus-item");
            menu.addEventListener("click", function () {
                item.method(item.id);
            });
            var icon = createElement("window-right-menus-item-icon");
            if (typeof item.icon === "string") {
                icon.innerHTML = item.icon;
            }
            else if (item.icon && item.icon.nodeName) {
                icon.appendChild(item.icon);
            }
            var name = createElement("window-right-menus-item-name");
            name.innerText = item.name;
            menu.appendChild(icon);
            menu.appendChild(name);
            menus.push(menu);
        });
        menus.forEach(function (menu) {
            menuBox.appendChild(menu);
        });
        return menuBox;
    };
    Menu.prototype.__set__event = function () {
        var _this = this;
        this.el.addEventListener("contextmenu", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var vw = window.innerWidth, vh = window.innerHeight;
            var left = e.pageX, top = e.pageY;
            if (vw - left < _this.width) {
                left = vw - _this.width;
            }
            if (vh - top < _this.height) {
                top = vh - _this.height;
            }
            _this.__left = left;
            _this.__top = top;
            _this.__status = "block";
        });
        this.el.addEventListener("click", function () {
            _this.__status = "none";
        });
        this.el.setAttribute("tabindex", "1");
        this.el.addEventListener("blur", function () {
            _this.__status = "none";
        });
    };
    return Menu;
}());
export { Menu };
export function installMenu(app) {
    app.directive("Rclick", {
        mounted: function (el, options) {
            new Menu(el, options.value);
        }
    });
}
export var $Menu = Menu;
var defaultMenus = [
    {
        id: 0,
        icon: dirSvg,
        name: "新建文件夹",
        method: function () {
            console.log("你点击了【新建文件夹】");
        }
    },
    {
        id: 1,
        name: "查看(V)",
        method: function () {
            console.log("你点击了【查看】");
        }
    },
    {
        id: 2,
        name: "排序方式(O)",
        method: function () {
            console.log("你点击了【排序方式】");
        }
    },
    {
        id: 3,
        name: "刷新",
        method: function () {
            console.log("你点击了【刷新】");
        }
    },
    {
        id: 4,
        icon: disSvg,
        name: "显示设置",
        method: function () {
            console.log("你点击了【显示设置】");
        }
    },
    {
        id: 4,
        icon: indSvg,
        name: "个性化",
        method: function () {
            console.log("你点击了【个性化】");
        }
    },
];
