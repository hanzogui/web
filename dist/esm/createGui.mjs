import { getConfigMaybe, setConfig, setTokens } from "./config.mjs";
import { createVariables } from "./createVariables.mjs";
import { defaultAnimationDriver } from "./helpers/defaultAnimationDriver.mjs";
import { resolveAnimationDriver } from "./helpers/resolveAnimationDriver.mjs";
import { buildCSSRuleSets, createFontCSS, createThemeCSS, createTokenCSS, getCSS as getCSSHelper } from "./helpers/createDesignSystem.mjs";
import { scanAllSheets } from "./helpers/insertStyleRule.mjs";
import { proxyThemesToParents } from "./helpers/proxyThemeToParents.mjs";
import { ensureThemeVariable } from "./helpers/themes.mjs";
import { configureMedia } from "./hooks/useMedia.mjs";
import { parseFont, registerFontVariables } from "./insertFont.mjs";
import { Gui } from "./Gui.mjs";
function shouldTokenCategoryHaveUnits(category) {
  const UNIT_CATEGORIES = /* @__PURE__ */new Set(["size", "space", "radius"]);
  return UNIT_CATEGORIES.has(category);
}
function initializeGuiConfig(config) {
  setConfig(config);
  configureMedia(config);
}
function createGui(configIn) {
  const existingConfig = getConfigMaybe();
  if (existingConfig) {
    configIn = {
      ...existingConfig,
      ...configIn
    };
  }
  const tokensParsed = {};
  const tokens = createVariables(configIn.tokens || {});
  if (configIn.tokens) {
    const tokensMerged = {};
    for (const cat in tokens) {
      tokensParsed[cat] = {};
      tokensMerged[cat] = {};
      const tokenCat = tokens[cat];
      for (const key in tokenCat) {
        const val = tokenCat[key];
        const prefixedKey = `$${key}`;
        tokensParsed[cat][prefixedKey] = val;
        tokensMerged[cat][prefixedKey] = val;
        tokensMerged[cat][key] = val;
      }
    }
    setTokens(tokensMerged);
  }
  let foundThemes;
  if (configIn.themes) {
    const noThemes = Object.keys(configIn.themes).length === 0;
    if (noThemes && !process.env.GUI_DID_OUTPUT_CSS) {
      foundThemes = scanAllSheets(noThemes, tokensParsed);
    }
  }
  let fontSizeTokens = null;
  let fontsParsed;
  if (configIn.fonts) {
    const fontTokens = Object.fromEntries(Object.entries(configIn.fonts).map(([k, v]) => {
      return [k, createVariables(v, "f", true)];
    }));
    fontsParsed = (() => {
      const res = {};
      for (const familyName in fontTokens) {
        const font = fontTokens[familyName];
        const fontParsed = parseFont(font);
        res[`$${familyName}`] = fontParsed;
        if (!fontSizeTokens && fontParsed.size) {
          fontSizeTokens = new Set(Object.keys(fontParsed.size));
        }
      }
      return res;
    })();
  }
  const specificTokens = {};
  const themeConfig = (() => {
    const sortedTokenKeys = Object.keys(tokens).sort();
    for (const key of sortedTokenKeys) {
      const sortedSubKeys = Object.keys(tokens[key]).sort();
      for (const skey of sortedSubKeys) {
        const variable = tokens[key][skey];
        specificTokens[`$${key}.${skey}`] = variable;
        if (process.env.NODE_ENV === "development") {
          if (typeof variable === "undefined") {
            throw new Error(`No value for tokens.${key}.${skey}:
${JSON.stringify(variable, null, 2)}`);
          }
        }
      }
    }
    const declarations = createTokenCSS(tokens, shouldTokenCategoryHaveUnits);
    const fontDeclarations = createFontCSS(fontsParsed, registerFontVariables);
    const cssRuleSets = buildCSSRuleSets(declarations, fontDeclarations);
    const themesIn = configIn.themes;
    const dedupedThemes = foundThemes ?? getThemesDeduped(themesIn, tokens.color);
    const themes = proxyThemesToParents(dedupedThemes);
    return {
      themes,
      cssRuleSets,
      getThemeRulesSets() {
        return createThemeCSS(dedupedThemes, configIn);
      }
    };
  })();
  const userShorthands = configIn.shorthands || {};
  const shorthands = {
    ...builtinShorthands,
    ...userShorthands
  };
  const lastCSSIndex = {
    value: -1
  };
  const getCSS = (opts = {}) => {
    return getCSSHelper(themeConfig, opts, lastCSSIndex);
  };
  const getNewCSS = opts => getCSS({
    ...opts,
    sinceLastCall: true
  });
  const defaultFontSetting = configIn.settings?.defaultFont;
  const defaultFont = (() => {
    let val = defaultFontSetting;
    if (val?.[0] === "$") {
      val = val.slice(1);
    }
    return val;
  })();
  const defaultPositionSetting = configIn.settings?.defaultPosition || "static";
  const defaultProps = configIn.defaultProps || {};
  if (defaultPositionSetting !== "static") {
    defaultProps.View = {
      ...defaultProps.View,
      position: defaultPositionSetting
    };
  }
  const defaultFontToken = defaultFont ? `$${defaultFont}` : "";
  const inputAnimations = configIn.animations;
  const resolvedDriver = resolveAnimationDriver(inputAnimations);
  const isMultiDriver = resolvedDriver !== null && resolvedDriver !== inputAnimations;
  const resolvedAnimations = resolvedDriver ?? inputAnimations;
  const animationDrivers = isMultiDriver ? inputAnimations : void 0;
  const config = {
    fonts: {},
    onlyAllowShorthands: false,
    fontLanguages: [],
    media: {},
    ...configIn,
    // normalized animations (resolved from multi-driver format if needed)
    animations: resolvedAnimations ?? defaultAnimationDriver,
    animationDrivers,
    defaultProps,
    settings: {
      webContainerType: "inline-size",
      ...configIn.settings
    },
    tokens,
    // vite made this into a function if it wasn't set
    shorthands,
    userShorthands,
    inverseShorthands: shorthands ? Object.fromEntries(Object.entries(shorthands).map(([k, v]) => [v, k])) : {},
    themes: themeConfig.themes,
    fontsParsed: fontsParsed || {},
    themeConfig,
    tokensParsed,
    parsed: true,
    getNewCSS,
    getCSS,
    defaultFont,
    fontSizeTokens: fontSizeTokens || /* @__PURE__ */new Set(),
    specificTokens,
    defaultFontToken
    // const tokens = [...getToken(tokens.size[0])]
    // .spacer-sm + ._dsp_contents._dsp-sm-hidden { margin-left: -var(--${}) }
  };
  initializeGuiConfig(config);
  if (process.env.NODE_ENV !== "development") {
    return config;
  }
  if (process.env.DEBUG?.startsWith("@hanzo/gui")) {
    console.info("Gui config:", config);
  }
  if (!globalThis["Gui"]) {
    globalThis["Gui"] = Gui;
  }
  return config;
}
function getThemesDeduped(themes, colorTokens) {
  const dedupedThemes = [];
  const existing = /* @__PURE__ */new Map();
  const sortedThemeNames = Object.keys(themes).sort();
  for (const themeName of sortedThemeNames) {
    const darkOrLightSpecificPrefix = themeName.startsWith("dark") ? "dark" : themeName.startsWith("light") ? "light" : "";
    const rawTheme = themes[themeName];
    const key = darkOrLightSpecificPrefix + JSON.stringify(rawTheme);
    if (existing.has(key)) {
      const e = existing.get(key);
      e.names.push(themeName);
      continue;
    }
    const theme = {
      ...colorTokens,
      ...rawTheme
    };
    for (const key2 in theme) {
      ensureThemeVariable(theme, key2);
    }
    const deduped = {
      names: [themeName],
      theme
    };
    dedupedThemes.push(deduped);
    existing.set(key, deduped);
  }
  return dedupedThemes;
}
const builtinShorthands = {
  bblr: "borderBottomLeftRadius",
  bbrr: "borderBottomRightRadius",
  bbs: "borderBottomStyle",
  bls: "borderLeftStyle",
  brc: "borderRightColor",
  brs: "borderRightStyle",
  brw: "borderRightWidth",
  bs: "borderStyle",
  btc: "borderTopColor",
  btlr: "borderTopLeftRadius",
  btrr: "borderTopRightRadius",
  bts: "borderTopStyle",
  btw: "borderTopWidth",
  bw: "borderWidth",
  bxs: "boxSizing",
  bxsh: "boxShadow",
  col: "color",
  cur: "cursor",
  dsp: "display",
  fb: "flexBasis",
  fd: "flexDirection",
  ff: "fontFamily",
  fs: "fontSize",
  fst: "fontStyle",
  fw: "fontWeight",
  fwr: "flexWrap",
  // height: 'h',
  lh: "lineHeight",
  ls: "letterSpacing",
  o: "opacity",
  ov: "overflow",
  ox: "overflowX",
  oy: "overflowY",
  pe: "pointerEvents",
  pos: "position",
  td: "textDecorationLine",
  tr: "transform",
  tt: "textTransform",
  va: "verticalAlign",
  wb: "wordBreak",
  // width: 'w',
  ws: "whiteSpace",
  ww: "wordWrap"
};
export { createGui };
//# sourceMappingURL=createGui.mjs.map
