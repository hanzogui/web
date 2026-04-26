import { nativeOnlyProps } from "./nativeOnlyProps.native.js";
import { webPropsToSkip } from "./webPropsToSkip.native.js";
var skipProps = {
  untilMeasured: 1,
  transition: 1,
  space: 1,
  animateOnly: 1,
  animatedBy: 1,
  disableClassName: 1,
  debug: 1,
  componentName: 1,
  disableOptimization: 1,
  render: 1,
  style: 1,
  // handled after loop so pseudos set usedKeys and override it if necessary
  group: 1,
  animatePresence: 1
};
if (process.env.NODE_ENV === "test") {
  skipProps["data-test-renders"] = 1;
}
if (true) {
  Object.assign(skipProps, webPropsToSkip);
}
if (false) {
  Object.assign(skipProps, nativeOnlyProps);
}
export { skipProps };
//# sourceMappingURL=skipProps.native.js.map
