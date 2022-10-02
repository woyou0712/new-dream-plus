/**
 * 直接导出
 */
export { Win } from "./Win/index";
export { Menu } from "./Rclick/index";
export { Message } from "./Message/index";
export { MessageBox } from "./MessageBox/index";

/**
 * 一起导出
 */
import { $Win } from "./Win/index";
import { $Menu, installMenu } from "./Rclick/index";
import { $MessageBox } from "./MessageBox/index";
import { $Message } from "./Message/index";
export default { Win: $Win, Menu: $Menu, install: installMenu, MessageBox: $MessageBox, Message: $Message };

// 挂在到window对象上
(window as { [key: string]: any }).$newDream = { Win: $Win, Menu: $Menu, MessageBox: $MessageBox, Message: $Message };