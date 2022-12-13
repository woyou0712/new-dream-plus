import createElement from "../utils/createElement";
import { loadingIcon } from "../svg/icons";
var Loading = (function () {
    function Loading(config) {
        var _this = this;
        var conf = { text: "拼命加载中...", type: "default", backgroundColor: "rgba(0,0,0,.8)", color: "#E6A23C" };
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
            }
        }
        this.box = createElement("new-window-loading-box");
        this.box.style["backgroundColor"] = conf.backgroundColor;
        this.content = createElement(["new-window-loading-content", conf.type]);
        this.content.style["color"] = conf.color;
        this.iconBox = createElement("new-window-loading-icon-box");
        if (conf.type === "default") {
            this.iconBox.innerHTML = loadingIcon;
        }
        else if (conf.type === "skip") {
            [null, null, null, null, null, null].forEach(function (e, i) {
                var ic = createElement(["new-window-loading-icon-skip", "index-".concat(i)]);
                ic.style["backgroundColor"] = conf.color;
                _this.iconBox.appendChild(ic);
            });
        }
        else if (conf.type === "heartbeat") {
            var ic = createElement("new-window-loading-icon-heartbeat");
            ic.style["borderColor"] = conf.color;
            ic.style["backgroundColor"] = conf.color;
            this.iconBox.appendChild(ic);
        }
        this.textBox = createElement("new-window-loading-text-box");
        var textItems = conf.text.split("");
        textItems.forEach(function (s, i) {
            var str = createElement(["new-window-loading-text-item", "index-".concat(i)]);
            str.innerText = s;
            _this.textBox.appendChild(str);
        });
        this.renderLoading();
    }
    Loading.prototype.renderLoading = function () {
        this.content.appendChild(this.iconBox);
        this.content.appendChild(this.textBox);
        this.box.appendChild(this.content);
        document.body.appendChild(this.box);
    };
    Loading.prototype.close = function () {
        var parentNode = this.box.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.box);
        }
    };
    return Loading;
}());
export { Loading };
export var $Loading = Loading;
