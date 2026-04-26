import { isWeb } from "@hanzogui/constants";
import { normalizeShadow } from "./normalizeShadow.mjs";
function fixStyles(style) {
  if (false) {
    if ("elevationAndroid" in style) {
      style["elevation"] = style.elevationAndroid;
      delete style.elevationAndroid;
    }
  }
  if (style.shadowRadius != null || style.shadowColor || style.shadowOpacity != null || style.shadowOffset) {
    Object.assign(style, normalizeShadow(style));
  }
  for (const key in borderDefaults) {
    if (key in style) {
      style[borderDefaults[key]] ||= "solid";
    }
  }
}
const nativeStyle = isWeb ? null : "borderStyle";
const borderDefaults = {
  borderWidth: "borderStyle",
  borderBottomWidth: nativeStyle || "borderBottomStyle",
  borderTopWidth: nativeStyle || "borderTopStyle",
  borderLeftWidth: nativeStyle || "borderLeftStyle",
  borderRightWidth: nativeStyle || "borderRightStyle"
  // TODO: need to add borderBlock and borderInline here, but they are alot and might impact performance
};
export { fixStyles };
//# sourceMappingURL=expandStyles.mjs.map
