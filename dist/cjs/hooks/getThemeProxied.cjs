var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);
var getThemeProxied_exports = {};
__export(getThemeProxied_exports, {
  getThemeProxied: () => getThemeProxied
});
module.exports = __toCommonJS(getThemeProxied_exports);
var import_constants = require("@hanzogui/constants");
var import_config = require("../config.cjs");
var import_createVariable = require("../createVariable.cjs");
var import_getDynamicVal = require("../helpers/getDynamicVal.cjs");
var import_doesRootSchemeMatchSystem = require("./doesRootSchemeMatchSystem.cjs");
const cache = /* @__PURE__ */new Map();
let curKeys;
let curSchemeKeys;
let curProps;
let curState;
const emptyObject = {};
function getThemeProxied(_props, _state, _keys, _schemeKeys) {
  if (!_state?.theme) {
    return emptyObject;
  }
  curKeys = _keys;
  curSchemeKeys = _schemeKeys;
  curProps = _props;
  curState = _state;
  if (cache.has(curState.theme)) {
    const proxied2 = cache.get(curState.theme);
    return proxied2;
  }
  const config = (0, import_config.getConfig)();
  function track(key, schemeOptimized = false) {
    if (!curKeys) return;
    if (!curKeys.current) {
      curKeys.current = /* @__PURE__ */new Set();
    }
    curKeys.current.add(key);
    if (schemeOptimized && curSchemeKeys) {
      if (!curSchemeKeys.current) {
        curSchemeKeys.current = /* @__PURE__ */new Set();
      }
      curSchemeKeys.current.add(key);
    }
    if (process.env.NODE_ENV === "development" && curProps.debug) {
      console.info(` \u{1F3A8} useTheme() tracking key: ${key} schemeOptimized=${schemeOptimized}`);
    }
  }
  const proxied = Object.fromEntries(Object.entries(_state.theme).flatMap(([key, value]) => {
    const proxied2 = {
      ...value,
      get val() {
        if (!globalThis.guiAvoidTracking) {
          track(key, false);
        }
        return value.val;
      },
      get(platform) {
        if (!curState) return;
        const outVal = (0, import_createVariable.getVariable)(value);
        const {
          name,
          scheme
        } = curState;
        if (false) {
          const fastSchemeChange = getSetting("fastSchemeChange");
          const rootMatchesSystem = doesRootSchemeMatchSystem();
          const shouldOptimize = scheme && platform !== "web" && isIos && !curProps.deopt && !curState.isInverse && fastSchemeChange && rootMatchesSystem;
          if (process.env.NODE_ENV === "development" && curProps.debug === "verbose") {
            console.info(` \u{1F3A8} useTheme().get(${key}) theme=${name} scheme=${scheme}`, `
   shouldOptimize=${shouldOptimize} (iOS=${isIos} deopt=${curProps.deopt} isInverse=${curState.isInverse} fastScheme=${fastSchemeChange} rootMatch=${rootMatchesSystem})`);
          }
          if (shouldOptimize) {
            const oppositeScheme = scheme === "dark" ? "light" : "dark";
            const oppositeName = name.replace(scheme, oppositeScheme);
            const color = (0, import_createVariable.getVariable)(config.themes[name]?.[key]);
            const oppositeColor = (0, import_createVariable.getVariable)(config.themes[oppositeName]?.[key]);
            if (process.env.NODE_ENV === "development" && curProps.debug === "verbose") {
              console.info(` \u{1F3A8} useTheme().get(${key}) using DynamicColorIOS`, `
   color=${color} oppositeColor=${oppositeColor}`);
            }
            const dynamicVal = getDynamicVal({
              scheme,
              val: color,
              oppositeVal: oppositeColor
            });
            track(key, true);
            return dynamicVal;
          }
          if (process.env.NODE_ENV === "development" && curProps.debug) {
            console.info(` \u{1F3A8} useTheme().get(${key}) tracking key (not optimizing)`, `
   platform=${platform} isIOS=${isIos} deopt=${curProps.deopt} fastScheme=${fastSchemeChange}`);
          }
          track(key, false);
        }
        return outVal;
      }
    };
    return [[key, proxied2], [`$${key}`, proxied2]];
  }));
  cache.set(_state.theme, proxied);
  return proxied;
}