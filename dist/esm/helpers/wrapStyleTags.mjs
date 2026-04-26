import { StyleObjectIdentifier, StyleObjectRules } from "@hanzogui/helpers";
import { Fragment, jsx } from "react/jsx-runtime";
function getStyleTags(styles) {
  if (true) {
    if (styles.length) {
      return /* @__PURE__ */jsx(Fragment, {
        children: styles.map(styleObject => {
          const identifier = styleObject[StyleObjectIdentifier];
          return /* @__PURE__ */jsx("style", {
            href: `t_${identifier}`,
            precedence: "default",
            suppressHydrationWarning: true,
            children: styleObject[StyleObjectRules].join("\n")
          }, identifier);
        })
      });
    }
  }
}
export { getStyleTags };
//# sourceMappingURL=wrapStyleTags.mjs.map
