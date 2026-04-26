function isGuiComponent(comp, name) {
  var config = comp === null || comp === void 0 ? void 0 : comp["staticConfig"];
  return Boolean(config && (name ? name === config.componentName : true));
}
export { isGuiComponent };
//# sourceMappingURL=isGuiComponent.native.js.map
