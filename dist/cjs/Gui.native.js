"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
// If the importer is in node compatibility mode or this is not an ESM
// file that has been converted to a CommonJS file using a Babel-
// compatible transform (i.e. "__esModule" has not been set), then set
// "default" to the CommonJS "module.exports" for node compatibility.
isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);
var Gui_exports = {};
__export(Gui_exports, {
  Gui: () => Gui,
  getValueFromIdentifier: () => getValueFromIdentifier,
  setIdentifierValue: () => setIdentifierValue
});
module.exports = __toCommonJS(Gui_exports);
var Helpers = __toESM(require("@hanzogui/helpers"), 1);
var import_config = require("./config.native.js");
var import_insertStyleRule = require("./helpers/insertStyleRule.native.js");
var import_mediaState = require("./helpers/mediaState.native.js");
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
            ...import_mediaState.mediaState
          };
        }
      }, {
        key: "config",
        get: function get() {
          return (0, import_config.getConfig)();
        }
      }, {
        key: "insertedRules",
        get: function get() {
          return (0, import_insertStyleRule.getAllRules)();
        }
      }, {
        key: "allSelectors",
        get: function get() {
          return (0, import_insertStyleRule.getAllSelectors)();
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
//# sourceMappingURL=Gui.native.js.map
