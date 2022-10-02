interface Option {
  id?: string
  name?: string
  class?: string | string[]
}


type Argument = string | string[] | Option

/**
 * 
 * @param argument 当参数为字符串或数组时，则用作元素class。
 * @returns 
 */
export default function createElement(argument?: Argument) {
  const option: Option = {}
  // 先整理参数
  if (typeof argument === "string" || Array.isArray(argument)) {
    option.class = argument
  } else if (argument) {
    if (argument.id) option.id = argument.id;
    if (argument.name) option.name = argument.name;
    if (argument.class) option.class = argument.class;
  }
  // 默认创建div
  option.name = option.name ? option.name : "div";
  const el = document.createElement(option.name);
  if (option.class) {
    if (typeof option.class === "string") {
      el.className = option.class
    } else if (Array.isArray(option.class)) {
      el.classList.add(...option.class)
    }
  }

  if (option.id) {
    el.setAttribute("id", option.id)
  }
  return el
}