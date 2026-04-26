import { stylePropsTextOnly, validStyles } from "@hanzogui/helpers";
import { createComponent } from "../createComponent.mjs";
const ellipsisStyle = true ? {
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
} : {
  numberOfLines: 1,
  lineBreakMode: "clip"
};
const Text = createComponent({
  componentName: "Text",
  acceptsClassName: true,
  isText: true,
  defaultProps: true ? void 0 : {
    suppressHighlighting: true
  },
  inlineWhenUnflattened: /* @__PURE__ */new Set(["fontFamily"]),
  variants: {
    ...{
      numberOfLines: {
        1: ellipsisStyle,
        ":number": numberOfLines => numberOfLines >= 1 ? {
          maxWidth: "100%",
          WebkitLineClamp: numberOfLines,
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
          overflow: "hidden"
        } : null
      }
    },
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
//# sourceMappingURL=Text.mjs.map
