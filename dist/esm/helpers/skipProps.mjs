import { nativeOnlyProps } from "./nativeOnlyProps.mjs";
const skipProps = {
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
if (false) {
  Object.assign(skipProps, webPropsToSkip);
}
if (true) {
  Object.assign(skipProps, nativeOnlyProps);
}
export { skipProps };
//# sourceMappingURL=skipProps.mjs.map
