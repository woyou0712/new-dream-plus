export default function createElement(argument) {
    var _a;
    var option = {};
    if (typeof argument === "string" || Array.isArray(argument)) {
        option.class = argument;
    }
    else if (argument) {
        if (argument.id)
            option.id = argument.id;
        if (argument.name)
            option.name = argument.name;
        if (argument.class)
            option.class = argument.class;
    }
    option.name = option.name ? option.name : "div";
    var el = document.createElement(option.name);
    if (option.class) {
        if (typeof option.class === "string") {
            el.className = option.class;
        }
        else if (Array.isArray(option.class)) {
            (_a = el.classList).add.apply(_a, option.class);
        }
    }
    if (option.id) {
        el.setAttribute("id", option.id);
    }
    return el;
}
