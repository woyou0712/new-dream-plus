import { WinEl } from "./WinEl";
import createElement from "../utils/createElement";
import { chromeSvg } from "../svg/button";
import setConfig from "./methods/setConfig";
import moveWin from "./methods/moveWin";
export var defaultConfig = {
    title: "新窗口",
    width: "800px",
    height: "600px",
    miniBtn: false,
    maxBtn: false,
    resize: false,
    icon: chromeSvg,
    url: "http://www.bauble.vip",
    sandbox: []
};
var Win = (function () {
    function Win(config) {
        this.status = "initial";
        this.config = defaultConfig;
        this.children = {};
        this.upStatus = "initial";
        this.zIndex = Win.zIndex;
        this.callbacks = {};
        Win.zIndex += 1;
        this.__config = config || defaultConfig;
        this.id = this.__config.id || Win.createId();
        if (Win.WinIdMap[this.id]) {
            var errMsg = "相同ID窗口已存在！无法继续创建";
            console.error(errMsg);
            throw new Error(errMsg);
        }
        this.__Els = new WinEl(this.__config);
        this.addMoveEvent();
        this.addButtonEvent();
        this.__init__show();
        this.__zIndex = Win.zIndex;
        if (Win.showMiniList && !Win.baseMiniEl) {
            Win.baseMiniEl = createBaseMiniEl();
        }
    }
    Object.defineProperty(Win.prototype, "__config", {
        get: function () {
            return this.config;
        },
        set: function (config) {
            this.config = setConfig(config, defaultConfig);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Win.prototype, "__status", {
        get: function () {
            return this.status;
        },
        set: function (v) {
            this.upStatus = this.status;
            this.setTop();
            switch (v) {
                case "initial":
                    this.__Els.setInitial(this.upStatus);
                    break;
                case "max":
                    this.__Els.setMax(this.upStatus);
                    break;
                case "mini":
                    this.__Els.setMini();
                    break;
                case "close":
                    this.toClose();
                    break;
            }
            this.status = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Win.prototype, "__zIndex", {
        get: function () {
            return this.zIndex;
        },
        set: function (v) {
            this.__Els.box.style.zIndex = String(v);
            this.zIndex = v;
        },
        enumerable: false,
        configurable: true
    });
    Win.prototype.__init__show = function () {
        var _this = this;
        if (this.config.parentId) {
            var parentWin = Win.WinIdMap[this.config.parentId];
            if (!parentWin) {
                return console.error("没有找到上级窗口！");
            }
            parentWin.__Els.content.appendChild(this.__Els.box);
            parentWin.children[this.id] = this;
        }
        else {
            document.body.appendChild(this.__Els.box);
        }
        Win.WinIdMap[this.id] = this;
        requestAnimationFrame(function () {
            if (_this.callbacks.mounted) {
                _this.callbacks.mounted(_this);
            }
        });
    };
    Win.prototype.addMoveEvent = function () {
        var _this = this;
        moveWin(this, function () {
            requestAnimationFrame(function () {
                if (_this.callbacks.move) {
                    _this.callbacks.move(_this);
                }
            });
        });
    };
    Win.prototype.addButtonEvent = function () {
        var _this = this;
        this.__Els.minimize.addEventListener("click", function () {
            _this.setMini();
        });
        this.__Els.maximize.addEventListener("click", function () {
            _this.setMax();
        });
        this.__Els.close.addEventListener("click", function () {
            _this.close();
        });
    };
    Win.prototype.toClose = function () {
        var childrenIds = Object.keys(this.children);
        if (childrenIds.length) {
            for (var _i = 0, childrenIds_1 = childrenIds; _i < childrenIds_1.length; _i++) {
                var key = childrenIds_1[_i];
                if (this.children[key]) {
                    this.children[key].toClose();
                }
            }
        }
        var parentNode = this.__Els.box.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.__Els.box);
        }
        delete Win.WinIdMap[this.id];
        if (this.__config.parentId) {
            delete Win.WinIdMap[this.__config.parentId].children[this.id];
        }
    };
    Win.prototype.appendMiniList = function () {
        if (!Win.showMiniList) {
            return;
        }
        var parentNode, parentMiniEl;
        if (this.__config.parentId && Win.WinIdMap[this.__config.parentId]) {
            parentNode = Win.WinIdMap[this.__config.parentId].__Els.content;
            parentMiniEl = Win.WinIdMap[this.__config.parentId].__Els.miniEl;
        }
        else {
            parentNode = document.body;
            parentMiniEl = Win.baseMiniEl;
        }
        if (this.__status === "mini") {
            parentMiniEl.appendChild(this.__Els.box);
        }
        else {
            parentNode.appendChild(this.__Els.box);
        }
    };
    Win.prototype.setTop = function () {
        var _this = this;
        requestAnimationFrame(function () {
            if (!_this.__zIndex || _this.__zIndex < Win.zIndex) {
                Win.zIndex += 1;
                _this.__zIndex = Win.zIndex;
                if (_this.callbacks.top) {
                    _this.callbacks.top(_this);
                }
            }
        });
    };
    Win.prototype.setMax = function () {
        var _this = this;
        if (this.__status === "max") {
            this.__status = "initial";
        }
        else {
            this.__status = "max";
        }
        requestAnimationFrame(function () {
            if (_this.callbacks.max) {
                _this.callbacks.max(_this);
            }
        });
        return this;
    };
    Win.prototype.setMini = function () {
        var _this = this;
        if (this.__status === "mini") {
            this.__status = this.upStatus;
        }
        else {
            this.__status = "mini";
        }
        this.appendMiniList();
        requestAnimationFrame(function () {
            if (_this.callbacks.mini) {
                _this.callbacks.mini(_this);
            }
        });
        return this;
    };
    Win.prototype.close = function () {
        var _this = this;
        this.__status = "close";
        requestAnimationFrame(function () {
            if (_this.callbacks.close) {
                _this.callbacks.close();
            }
        });
    };
    Win.prototype.onmounted = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.mounted = fn;
        }
        return this;
    };
    Win.prototype.onmini = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.mini = fn;
        }
        return this;
    };
    Win.prototype.onmax = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.max = fn;
        }
        return this;
    };
    Win.prototype.onclose = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.close = fn;
        }
        return this;
    };
    Win.prototype.ontop = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.top = fn;
        }
        return this;
    };
    Win.prototype.onmove = function (fn) {
        if (typeof fn === "function") {
            this.callbacks.move = fn;
        }
        return this;
    };
    Win.createId = function () {
        var random = "abcdefghijklmnopqrstuvwxyz";
        var rdStr = "";
        for (var i = 0; i < 8; i++) {
            rdStr += random[parseInt(String(Math.random() * random.length))];
        }
        return "new-dream-".concat(rdStr, "-").concat(Date.now());
    };
    Win.WinIdMap = {};
    Win.Shade = createElement({ id: "new-windows-shade" });
    Win.zIndex = 0;
    Win.showMiniList = true;
    return Win;
}());
export { Win };
function createBaseMiniEl() {
    var el = createElement("new-windows-mini-list-box");
    document.body.appendChild(el);
    return el;
}
export var $Win = Win;
