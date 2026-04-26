const ReactNativeStaticConfigs = /* @__PURE__ */new WeakMap();
function getReactNativeConfig(Component) {
  if (!Component) return;
  if (false) {
    if (Component.propTypes?.onTextInput || Component.propTypes?.onChangeText) {
      return RNConfigs.TextInput;
    }
    if (Component.getSizeWithHeaders) {
      return RNConfigs.Image;
    }
    if (Component.propTypes?.textBreakStrategy) {
      return RNConfigs.Text;
    }
    return RNConfigs.default;
  }
  if (Component.getSize && Component.prefetch) {
    return RNConfigs.Image;
  }
  if (Component.displayName === "Text" && Component.render) {
    return RNConfigs.Text;
  }
  if (Component.render && (Component.displayName === "ScrollView" || Component.displayName === "View")) {
    return RNConfigs.default;
  }
  if (Component.State?.blurTextInput) {
    return RNConfigs.TextInput;
  }
  return ReactNativeStaticConfigs.get(Component);
}
const RNConfigs = {
  Image: {
    isReactNative: true,
    inlineProps: /* @__PURE__ */new Set(["src", "width", "height"])
  },
  Text: {
    isReactNative: true,
    isText: true
  },
  TextInput: {
    isReactNative: true,
    isInput: true,
    isText: true
  },
  default: {
    isReactNative: true
  }
};
export { getReactNativeConfig };
//# sourceMappingURL=setupReactNative.mjs.map
