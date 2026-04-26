"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);
var wrapStyleTags_exports = {};
__export(wrapStyleTags_exports, {
  getStyleTags: () => getStyleTags
});
module.exports = __toCommonJS(wrapStyleTags_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_helpers = require("@hanzogui/helpers");
function getStyleTags(styles) {
  if (false) {
    if (styles.length) {
      return /* @__PURE__ */(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
        children: styles.map(function (styleObject) {
          var identifier = styleObject[import_helpers.StyleObjectIdentifier];
          return /* @__PURE__ */(0, import_jsx_runtime.jsx)("style", {
            // @ts-ignore
            href: `t_${identifier}`,
            // @ts-ignore
            precedence: "default",
            // we remove after first render in favor of inserting to a global stylesheet (faster)
            suppressHydrationWarning: true,
            children: styleObject[import_helpers.StyleObjectRules].join("\n")
          }, identifier);
        })
      });
    }
  }
}
//# sourceMappingURL=wrapStyleTags.native.js.map
