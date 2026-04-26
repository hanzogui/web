import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { StyleObjectIdentifier, StyleObjectRules } from "@hanzogui/helpers";
function getStyleTags(styles) {
  if (false) {
    if (styles.length) {
      return /* @__PURE__ */_jsx(_Fragment, {
        children: styles.map(function (styleObject) {
          var identifier = styleObject[StyleObjectIdentifier];
          return /* @__PURE__ */_jsx("style", {
            // @ts-ignore
            href: `t_${identifier}`,
            // @ts-ignore
            precedence: "default",
            // we remove after first render in favor of inserting to a global stylesheet (faster)
            suppressHydrationWarning: true,
            children: styleObject[StyleObjectRules].join("\n")
          }, identifier);
        })
      });
    }
  }
}
export { getStyleTags };
//# sourceMappingURL=wrapStyleTags.native.js.map
