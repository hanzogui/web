import { isTouchable, isWeb } from "@hanzogui/constants";
import { useDidFinishSSR } from "@hanzogui/use-did-finish-ssr";
const useIsTouchDevice = () => {
  return !isWeb ? true : useDidFinishSSR() ? isTouchable : false;
};
export { useIsTouchDevice };
//# sourceMappingURL=useIsTouchDevice.mjs.map
