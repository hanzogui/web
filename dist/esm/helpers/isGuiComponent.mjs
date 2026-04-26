function isGuiComponent(comp, name) {
  const config = comp?.["staticConfig"];
  return Boolean(config && (name ? name === config.componentName : true));
}
export { isGuiComponent };
//# sourceMappingURL=isGuiComponent.mjs.map
