export default function (config, defaultConfig) {
    if (!config) {
        config = defaultConfig;
    }
    var component = config.component;
    if (!config.icon) {
        config.icon = component && component.icon ? component.icon : defaultConfig.icon;
    }
    if (!config.title) {
        config.title = component && component.title ? component.title : defaultConfig.title;
    }
    var reg = /^\d+px$/;
    if (!reg.test(String(config.width))) {
        config.width = component && component.width ? component.width : defaultConfig.width;
    }
    if (!reg.test(String(config.height))) {
        config.height = component && component.height ? component.height : defaultConfig.height;
    }
    if (config.miniBtn === undefined) {
        config.miniBtn = component && component.miniBtn ? component.miniBtn : defaultConfig.miniBtn;
    }
    if (config.maxBtn === undefined) {
        config.maxBtn = component && component.maxBtn ? component.maxBtn : defaultConfig.maxBtn;
    }
    if (config.resize === undefined) {
        config.resize = component && component.resize ? component.resize : defaultConfig.resize;
    }
    if (!config.component && !config.url) {
        config.url = defaultConfig.url;
    }
    if (!config.sandbox) {
        config.sandbox = defaultConfig.sandbox;
    }
    return config;
}
