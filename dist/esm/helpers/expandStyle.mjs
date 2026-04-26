import { isWeb } from "@hanzogui/constants";
import { getSetting } from "../config.mjs";
const neg1Flex = [["flexGrow", 0], ["flexShrink", 1], ["flexBasis", "auto"]];
function expandStyle(key, value) {
  if (true) {
    if (key === "flex") {
      if (value === -1) {
        return neg1Flex;
      }
      return [["flexGrow", value], ["flexShrink", 1], ["flexBasis", getSetting("styleCompat") === "legacy" ? "auto" : 0]];
    }
    switch (key) {
      case "writingDirection":
        {
          return [["direction", value]];
        }
      // some safari-based browsers seem not to support without -webkit prefix
      case "backdropFilter":
        {
          return [["backdropFilter", value], ["WebkitBackdropFilter", value]];
        }
    }
  }
  if (false) {
    if (isAndroid && key === "elevationAndroid") {
      return [["elevation", value]];
    }
    switch (key) {
      case "objectFit":
        {
          const resizeMode = resizeModeMap[value] || "cover";
          return [["resizeMode", resizeMode]];
        }
      case "verticalAlign":
        {
          return [["textAlignVertical", verticalAlignMap[value] || "auto"]];
        }
      case "position":
        {
          if (value === "fixed" || value === "sticky") {
            return [["position", "absolute"]];
          }
          return;
        }
      case "backgroundImage":
        {
          return [["experimental_backgroundImage", value]];
        }
      case "border":
        {
          if (typeof value === "string") {
            const parsed = parseBorderShorthand(value);
            if (parsed) {
              return parsed;
            }
          }
          return;
        }
      case "outline":
        {
          if (typeof value === "string") {
            const parsed = parseOutlineShorthand(value);
            if (parsed) {
              return parsed;
            }
          }
          return;
        }
    }
    if (key in nativeExpansions) {
      return nativeExpansions[key].map(k => [k, value]);
    }
  }
  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map(k => [k, value]);
  }
}
const all = ["Top", "Right", "Bottom", "Left"];
const horiz = ["Right", "Left"];
const vert = ["Top", "Bottom"];
const xy = ["X", "Y"];
const EXPANSIONS = {
  borderColor: ["TopColor", "RightColor", "BottomColor", "LeftColor"],
  borderRadius: ["TopLeftRadius", "TopRightRadius", "BottomRightRadius", "BottomLeftRadius"],
  borderWidth: ["TopWidth", "RightWidth", "BottomWidth", "LeftWidth"],
  margin: all,
  marginHorizontal: horiz,
  marginVertical: vert,
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
  ...(isWeb && {
    // react-native only supports borderStyle
    borderStyle: ["TopStyle", "RightStyle", "BottomStyle", "LeftStyle"],
    // react-native doesn't support X / Y
    overflow: xy,
    overscrollBehavior: xy
  })
};
for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length);
  EXPANSIONS[parent] = EXPANSIONS[parent].map(k => `${prefix}${k}`);
}
export { expandStyle };
//# sourceMappingURL=expandStyle.mjs.map
