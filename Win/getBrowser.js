export default function () {
  var ua = navigator.userAgent.toLowerCase(),
    name = "";
  ua.match(/firefox\/([\d.]+)/)
    ? (name = "firefox")
    : ua.match(/chrome\/([\d.]+)/)
    ? (name = "chrome")
    : ua.match(/opera.([\d.]+)/)
      ? (name = "opera")
      : ua.match(/version\/([\d.]+).*safari/)
        ? (name = "safari")
        : (name = "ie");
  return name;
}
