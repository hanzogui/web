import { isTouchable, isWeb } from "@hanzogui/constants";
import { useDidFinishSSR } from "@hanzogui/use-did-finish-ssr";
var useIsTouchDevice = function () {
  return !isWeb ? true : useDidFinishSSR() ? isTouchable : false;
};
export { useIsTouchDevice };
//# sourceMappingURL=useIsTouchDevice.native.js.map
