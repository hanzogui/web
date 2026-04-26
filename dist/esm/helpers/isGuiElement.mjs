import React from "react";
import { isGuiComponent } from "./isGuiComponent.mjs";
const isGuiElement = (child, name) => {
  return React.isValidElement(child) && isGuiComponent(child.type, name);
};
export { isGuiElement };
//# sourceMappingURL=isGuiElement.mjs.map
