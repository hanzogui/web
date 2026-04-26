import { jsx as _jsx } from "react/jsx-runtime";
import { useIsomorphicLayoutEffect } from "@hanzogui/constants";
import { useId } from "react";
import { getSetting } from "../config.native.js";
import { THEME_CLASSNAME_PREFIX } from "../constants/constants.native.js";
import { Theme } from "./Theme.native.js";
var ThemeProvider = function (props) {
  "use no memo";

  var addThemeClassName = getSetting("addThemeClassName");
  if (false) {
    useIsomorphicLayoutEffect(function () {
      if (addThemeClassName === false) return;
      var cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`;
      var target = getSetting("addThemeClassName") === "html" ? document.documentElement : document.body;
      target.classList.add(cn);
      return function () {
        target.classList.remove(cn);
      };
    }, [props.defaultTheme, addThemeClassName]);
  }
  var forceClassName = addThemeClassName === void 0;
  return /* @__PURE__ */_jsx(Theme, {
    className: props.className,
    name: props.defaultTheme,
    forceClassName,
    // @ts-expect-error
    _isRoot: useId,
    children: props.children
  });
};
export { ThemeProvider };
//# sourceMappingURL=ThemeProvider.native.js.map
