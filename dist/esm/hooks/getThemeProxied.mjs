import { getConfig } from "../config.mjs";
import { getVariable } from "../createVariable.mjs";
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
  const config = getConfig();
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
        const outVal = getVariable(value);
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
            const color = getVariable(config.themes[name]?.[key]);
            const oppositeColor = getVariable(config.themes[oppositeName]?.[key]);
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
export { getThemeProxied };
//# sourceMappingURL=getThemeProxied.mjs.map
