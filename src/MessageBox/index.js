import createElement from "../utils/createElement";
var MessageBox = (function () {
    function MessageBox(option) {
        this.title = "提示";
        this.msg = "确认消息";
        this.cancelName = "取消";
        this.submitName = "确定";
        this.methods = {};
        if (typeof option === "string") {
            this.msg = option;
        }
        else if (option) {
            if (option.msg) {
                this.msg = option.msg;
            }
            if (option.title) {
                this.title = option.title;
            }
            if (option.cancelName) {
                this.cancelName = option.cancelName;
            }
            if (option.submitName) {
                this.submitName = option.submitName;
            }
        }
        this.el = this.__create__element();
        MessageBox.defaultContentBox.appendChild(this.el);
    }
    MessageBox.prototype.__create__element = function () {
        var _this = this;
        var box = createElement("new-window-message-box");
        var head = createElement("head");
        head.innerText = this.title;
        box.appendChild(head);
        var content = createElement("content");
        content.innerText = this.msg;
        box.appendChild(content);
        var btns = createElement("btns");
        var cancelBtn = createElement("btn");
        cancelBtn.innerText = this.cancelName;
        cancelBtn.addEventListener("click", function () {
            _this.close();
            if (_this.methods.cancel) {
                _this.methods.cancel();
            }
        });
        btns.appendChild(cancelBtn);
        var submitBtn = createElement("btn primary");
        submitBtn.innerText = this.submitName;
        submitBtn.addEventListener("click", function () {
            _this.close();
            if (_this.methods.submit) {
                _this.methods.submit();
            }
        });
        btns.appendChild(submitBtn);
        box.appendChild(btns);
        return box;
    };
    MessageBox.prototype.close = function () {
        var p = this.el.parentNode;
        if (p) {
            p.removeChild(this.el);
        }
    };
    MessageBox.prototype.cancel = function (callback) {
        this.methods.cancel = callback;
        return this;
    };
    MessageBox.prototype.submit = function (callback) {
        this.methods.submit = callback;
        return this;
    };
    MessageBox.defaultContentBox = document.body;
    return MessageBox;
}());
export { MessageBox };
export var $MessageBox = MessageBox;
