import createElement from "../utils/createElement";
var Message = (function () {
    function Message(option) {
        this.msg = "轻提示";
        this.type = "info";
        this.time = 3000;
        if (typeof option === "string") {
            this.msg = option;
        }
        else if (option) {
            this.msg = option.msg;
            if (option.type) {
                this.type = option.type;
            }
            if (option.time) {
                this.time = option.time;
            }
        }
        this.__show_message();
    }
    Message.prototype.__show_message = function () {
        var msgBox = createElement("new-window-message");
        msgBox.classList.add(this.type);
        msgBox.innerText = this.msg;
        Message.defaultContentBox.appendChild(msgBox);
        setTimeout(function () {
            var p = msgBox.parentNode;
            if (p) {
                p.removeChild(msgBox);
            }
        }, this.time);
    };
    Message.error = function (msg) {
        new Message({ msg: msg, type: "error" });
    };
    Message.success = function (msg) {
        new Message({ msg: msg, type: "success" });
    };
    Message.info = function (msg) {
        new Message({ msg: msg, type: "info" });
    };
    Message.defaultContentBox = document.body;
    return Message;
}());
export { Message };
export var $Message = Message;
