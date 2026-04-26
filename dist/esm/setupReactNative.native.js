var ReactNativeStaticConfigs = /* @__PURE__ */new WeakMap();
function getReactNativeConfig(Component) {
  var _Component_State;
  if (!Component) return;
  if (true) {
    var _Component_propTypes, _Component_propTypes1, _Component_propTypes2;
    if (((_Component_propTypes = Component.propTypes) === null || _Component_propTypes === void 0 ? void 0 : _Component_propTypes.onTextInput) || ((_Component_propTypes1 = Component.propTypes) === null || _Component_propTypes1 === void 0 ? void 0 : _Component_propTypes1.onChangeText)) {
      return RNConfigs.TextInput;
    }
    if (Component.getSizeWithHeaders) {
      return RNConfigs.Image;
    }
    if ((_Component_propTypes2 = Component.propTypes) === null || _Component_propTypes2 === void 0 ? void 0 : _Component_propTypes2.textBreakStrategy) {
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
  if ((_Component_State = Component.State) === null || _Component_State === void 0 ? void 0 : _Component_State.blurTextInput) {
    return RNConfigs.TextInput;
  }
  return ReactNativeStaticConfigs.get(Component);
}
var RNConfigs = {
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
//# sourceMappingURL=setupReactNative.native.js.map
