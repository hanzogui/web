import * as Helpers from "@hanzogui/helpers";
import { getConfig } from "./config.mjs";
import { getAllRules, getAllSelectors } from "./helpers/insertStyleRule.mjs";
import { mediaState } from "./helpers/mediaState.mjs";
const Gui = (() => {
  if (process.env.NODE_ENV === "development") {
    class GuiManager {
      Helpers = Helpers;
      get mediaState() {
        return {
          ...mediaState
        };
      }
      get config() {
        return getConfig();
      }
      get insertedRules() {
        return getAllRules();
      }
      get allSelectors() {
        return getAllSelectors();
      }
      get identifierToValue() {
        return identifierToValue;
      }
    }
    return new GuiManager();
  }
})();
const identifierToValue = /* @__PURE__ */new Map();
const getValueFromIdentifier = identifier => {
  return identifierToValue.get(identifier);
};
const setIdentifierValue = (identifier, value) => {
  identifierToValue.set(identifier, value);
};
export { Gui, getValueFromIdentifier, setIdentifierValue };
//# sourceMappingURL=Gui.mjs.map
