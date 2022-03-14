import getBrowser from "../Win/getBrowser";
export default [
  {
    icon: null,
    name: "刷新",
    fn: function () {
      location.reload()
    }
  },
  {
    icon: null,
    name: "全屏",
    fn: function () {
      if (getBrowser() == "ie") {
        alert("当前浏览器不支持该功能,请尝试手动按F11");
        return;
      }
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      }
    }
  },
  {
    icon: null,
    name: "退出全屏",
    fn: function () {
      if (getBrowser() == "ie") {
        alert("当前浏览器不支持该功能,请尝试手动按F11");
        return;
      }
      if (
        !!document.fullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.webkitFullscreenElement
      ) {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    }
  },


]