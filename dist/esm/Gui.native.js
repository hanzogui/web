import * as Helpers from "@hanzogui/helpers";
import { getConfig } from "./config.native.js";
import { getAllRules, getAllSelectors } from "./helpers/insertStyleRule.native.js";
import { mediaState } from "./helpers/mediaState.native.js";
function _class_call_check(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _create_class(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _define_property(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Gui = function () {
  if (process.env.NODE_ENV === "development") {
    var GuiManager = /* @__PURE__ */function () {
      "use strict";

      function GuiManager2() {
        _class_call_check(this, GuiManager2);
        _define_property(this, "Helpers", Helpers);
      }
      _create_class(GuiManager2, [{
        key: "mediaState",
        get: function get() {
          return {
            ...mediaState
          };
        }
      }, {
        key: "config",
        get: function get() {
          return getConfig();
        }
      }, {
        key: "insertedRules",
        get: function get() {
          return getAllRules();
        }
      }, {
        key: "allSelectors",
        get: function get() {
          return getAllSelectors();
        }
      }, {
        key: "identifierToValue",
        get: function get() {
          return identifierToValue;
        }
      }]);
      return GuiManager2;
    }();
    return new GuiManager();
  }
}();
var identifierToValue = /* @__PURE__ */new Map();
var getValueFromIdentifier = function (identifier) {
  return identifierToValue.get(identifier);
};
var setIdentifierValue = function (identifier, value) {
  identifierToValue.set(identifier, value);
};
export { Gui, getValueFromIdentifier, setIdentifierValue };
//# sourceMappingURL=Gui.native.js.map
