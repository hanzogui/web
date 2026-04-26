import React from "react";
import { isGuiComponent } from "./isGuiComponent.native.js";
var isGuiElement = function (child, name) {
  return /* @__PURE__ */React.isValidElement(child) && isGuiComponent(child.type, name);
};
export { isGuiElement };
//# sourceMappingURL=isGuiElement.native.js.map
