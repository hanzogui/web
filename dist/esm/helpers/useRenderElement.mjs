import { cloneElement, createElement, isValidElement } from "react";
import { composeRefs } from "@hanzogui/compose-refs";
import { mergeSlotStyleProps } from "./mergeSlotStyleProps.mjs";
function evaluateRenderProp(render, props, state, defaultElement) {
  if (!render) {
    return defaultElement;
  }
  const defaultChildren = defaultElement.props.children;
  if (typeof render === "string") {
    if (false) {
      return defaultElement;
    }
    return createElement(render, props, defaultChildren);
  }
  if (typeof render === "function") {
    return render(props, state);
  }
  if (isValidElement(render)) {
    const renderProps = render.props;
    const renderRef = renderProps?.ref;
    if (!renderProps || Object.keys(renderProps).length === 0) {
      if (renderRef) {
        return cloneElement(render, {
          ...props,
          ref: composeRefs(props.ref, renderRef)
        }, defaultChildren);
      }
      return cloneElement(render, props, defaultChildren);
    }
    const merged = mergeSlotStyleProps({
      ...props
    }, renderProps);
    const children = renderProps.children ?? defaultChildren;
    return cloneElement(render, merged, children);
  }
  return defaultElement;
}
export { evaluateRenderProp };
//# sourceMappingURL=useRenderElement.mjs.map
