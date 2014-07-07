define(function (require, exports, module) {
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    ExtensionUtils.loadStyleSheet(module, 'styles/main.css');

    require('./services/mutation').init();
    require('./services/registry').init();
});
