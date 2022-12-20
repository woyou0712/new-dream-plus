import createElement from "../utils/createElement";
import { loadingIcon } from "../svg/icons";
var Loading = (function () {
    function Loading() {
        var _this = this;
        this.status = 0;
        this.box = createElement("new-window-loading-box");
        this.content = createElement();
        this.iconBox = createElement("new-window-loading-icon-box");
        this.textBox = createElement("new-window-loading-text-box");
        this.defaultIcon = loadingIcon;
        this.heartbeatIcon = createElement("new-window-loading-icon-heartbeat-box");
        [0, 1, 2, 3, 4, 5].forEach(function (i) {
            var ic = createElement(["new-window-loading-icon-heartbeat", "index-".concat(i)]);
            _this.heartbeatIcon.appendChild(ic);
        });
        this.skipIcon = createElement("new-window-loading-icon-skip");
        this.content.appendChild(this.iconBox);
        this.content.appendChild(this.textBox);
        this.box.appendChild(this.content);
    }
    Loading.prototype.renderLoading = function (config) {
        this.box.style["backgroundColor"] = config.backgroundColor;
        this.content.className = "new-window-loading-content ".concat(config.type);
        this.content.style["color"] = config.color;
        if (config.textAnimation) {
            this.textBox.classList.add("animation");
        }
        this.setText(config.text);
        this.iconBox.innerHTML = "";
        if (config.type === "default") {
            this.iconBox.innerHTML = this.defaultIcon;
        }
        else if (config.type === "heartbeat") {
            var nodes = this.heartbeatIcon.childNodes;
            nodes.forEach(function (e) {
                e.style["backgroundColor"] = config.color;
            });
            this.iconBox.appendChild(this.heartbeatIcon);
        }
        else if (config.type === "skip") {
            this.skipIcon.style["borderColor"] = config.color;
            this.skipIcon.style["backgroundColor"] = config.color;
            this.iconBox.appendChild(this.skipIcon);
        }
        document.body.appendChild(this.box);
    };
    Loading.prototype.setText = function (text) {
        var _this = this;
        var textItems = text.split("");
        this.textBox.innerHTML = "";
        textItems.forEach(function (s, i) {
            var str = createElement(["new-window-loading-text-item", "index-".concat(i)]);
            str.innerText = s;
            _this.textBox.appendChild(str);
        });
    };
    Loading.prototype.start = function (config) {
        var conf = { text: "拼命加载中...", type: "default", backgroundColor: "rgba(0,0,0,.8)", color: "#409EFF", textAnimation: false };
        if (config) {
            if (typeof config === "string") {
                conf.text = config;
            }
            else {
                if (config.text) {
                    conf.text = config.text;
                }
                if (config.backgroundColor) {
                    conf.backgroundColor = config.backgroundColor;
                }
                if (config.type) {
                    conf.type = config.type;
                }
                if (config.color) {
                    conf.color = config.color;
                }
                if (config.textAnimation) {
                    conf.textAnimation = config.textAnimation;
                }
            }
        }
        this.status = 1;
        this.renderLoading(conf);
    };
    Loading.prototype.update = function (text) {
        if (this.status === 0) {
            console.error("loading动画尚未开始，无法更新");
        }
        else {
            this.status === 1;
            this.setText(text);
        }
        return this;
    };
    Loading.prototype.close = function () {
        this.status = 0;
        var parentNode = this.box.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.box);
        }
    };
    return Loading;
}());
export { Loading };
export var $Loading = Loading;
