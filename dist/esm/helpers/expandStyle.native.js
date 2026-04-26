import { isAndroid, isWeb } from "@hanzogui/constants";
import { getSetting } from "../config.native.js";
import { parseBorderShorthand } from "./parseBorderShorthand.native.js";
import { parseOutlineShorthand } from "./parseOutlineShorthand.native.js";
var _loop = function (parent) {
  var _exec;
  var _exec_index;
  var prefix = parent.slice(0, (_exec_index = (_exec = /[A-Z]/.exec(parent)) === null || _exec === void 0 ? void 0 : _exec.index) !== null && _exec_index !== void 0 ? _exec_index : parent.length);
  EXPANSIONS[parent] = EXPANSIONS[parent].map(function (k) {
    return `${prefix}${k}`;
  });
};
function expandStyle(key, value) {
  if (false) {
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
  if (true) {
    if (isAndroid && key === "elevationAndroid") {
      return [["elevation", value]];
    }
    switch (key) {
      case "objectFit":
        {
          var resizeMode = resizeModeMap[value] || "cover";
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
            var parsed = parseBorderShorthand(value);
            if (parsed) {
              return parsed;
            }
          }
          return;
        }
      case "outline":
        {
          if (typeof value === "string") {
            var parsed1 = parseOutlineShorthand(value);
            if (parsed1) {
              return parsed1;
            }
          }
          return;
        }
    }
    if (key in nativeExpansions) {
      return nativeExpansions[key].map(function (k) {
        return [k, value];
      });
    }
  }
  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map(function (k) {
      return [k, value];
    });
  }
}
var resizeModeMap = {
  fill: "stretch",
  none: "center",
  "scale-down": "contain",
  contain: "contain",
  cover: "cover"
};
var verticalAlignMap = {
  top: "top",
  middle: "center",
  bottom: "bottom",
  auto: "auto"
};
var all = ["Top", "Right", "Bottom", "Left"];
var horiz = ["Right", "Left"];
var vert = ["Top", "Bottom"];
var xy = ["X", "Y"];
var EXPANSIONS = {
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
for (var parent in EXPANSIONS) _loop(parent);
var nativeExpansions = {
  // logical border properties
  borderBlockColor: ["borderTopColor", "borderBottomColor"],
  borderInlineColor: ["borderEndColor", "borderStartColor"],
  borderBlockWidth: ["borderTopWidth", "borderBottomWidth"],
  borderInlineWidth: ["borderEndWidth", "borderStartWidth"],
  borderBlockStyle: ["borderTopStyle", "borderBottomStyle"],
  borderInlineStyle: ["borderEndStyle", "borderStartStyle"],
  borderBlockStartColor: ["borderTopColor"],
  borderBlockEndColor: ["borderBottomColor"],
  borderInlineStartColor: ["borderStartColor"],
  borderInlineEndColor: ["borderEndColor"],
  borderBlockStartWidth: ["borderTopWidth"],
  borderBlockEndWidth: ["borderBottomWidth"],
  borderInlineStartWidth: ["borderStartWidth"],
  borderInlineEndWidth: ["borderEndWidth"],
  borderBlockStartStyle: ["borderTopStyle"],
  borderBlockEndStyle: ["borderBottomStyle"],
  borderInlineStartStyle: ["borderStartStyle"],
  borderInlineEndStyle: ["borderEndStyle"],
  // logical margin/padding
  marginBlock: ["marginTop", "marginBottom"],
  marginInline: ["marginEnd", "marginStart"],
  paddingBlock: ["paddingTop", "paddingBottom"],
  paddingInline: ["paddingEnd", "paddingStart"],
  marginBlockStart: ["marginTop"],
  marginBlockEnd: ["marginBottom"],
  marginInlineStart: ["marginStart"],
  marginInlineEnd: ["marginEnd"],
  paddingBlockStart: ["paddingTop"],
  paddingBlockEnd: ["paddingBottom"],
  paddingInlineStart: ["paddingStart"],
  paddingInlineEnd: ["paddingEnd"],
  // logical sizing
  minBlockSize: ["minHeight"],
  maxBlockSize: ["maxHeight"],
  minInlineSize: ["minWidth"],
  maxInlineSize: ["maxWidth"],
  blockSize: ["height"],
  inlineSize: ["width"],
  // inset
  inset: ["top", "right", "bottom", "left"],
  insetBlock: ["top", "bottom"],
  insetBlockStart: ["top"],
  insetBlockEnd: ["bottom"],
  insetInlineStart: ["left"],
  insetInlineEnd: ["right"]
};
export { expandStyle };
//# sourceMappingURL=expandStyle.native.js.map
