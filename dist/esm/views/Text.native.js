import { stylePropsTextOnly, validStyles } from "@hanzogui/helpers";
import { createComponent } from "../createComponent.native.js";
var ellipsisStyle = false ? {
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
} : {
  numberOfLines: 1,
  lineBreakMode: "clip"
};
var Text = createComponent({
  componentName: "Text",
  acceptsClassName: true,
  isText: true,
  defaultProps: false ? void 0 : {
    suppressHighlighting: true
  },
  inlineWhenUnflattened: /* @__PURE__ */new Set(["fontFamily"]),
  variants: {
    ...false,
    ellipsis: {
      true: ellipsisStyle
    }
  },
  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly
  }
});
export { Text };
//# sourceMappingURL=Text.native.js.map
