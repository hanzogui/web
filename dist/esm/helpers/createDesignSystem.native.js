import { isWeb } from "@hanzogui/constants";
import { getVariableVariable, isVariable } from "../createVariable.native.js";
import { autoVariables, registerCSSVariable, variableToCSS } from "./registerCSSVariable.native.js";
import { getThemeCSSRules } from "./getThemeCSSRules.native.js";
import { getAllRules } from "./insertStyleRule.native.js";
function getFontPropertyDeclarations(fontParsed) {
  var tokenKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "$true";
  var props = ["font-family: var(--f-family)"];
  var getVarRef = function (obj) {
    var val = obj === null || obj === void 0 ? void 0 : obj[tokenKey];
    if (isVariable(val)) {
      return getVariableVariable(val);
    }
    return void 0;
  };
  var letterSpacing = getVarRef(fontParsed.letterSpacing);
  if (letterSpacing) props.push(`letter-spacing: ${letterSpacing}`);
  var lineHeight = getVarRef(fontParsed.lineHeight);
  if (lineHeight) props.push(`line-height: ${lineHeight}`);
  var fontStyle = getVarRef(fontParsed.style);
  if (fontStyle) props.push(`font-style: ${fontStyle}`);
  var fontWeight = getVarRef(fontParsed.weight);
  if (fontWeight) props.push(`font-weight: ${fontWeight}`);
  return props;
}
function createTokenCSS(tokens, shouldTokenCategoryHaveUnits) {
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    var declarations = [];
    var sortedTokenKeys = Object.keys(tokens).sort();
    var _iteratorNormalCompletion = true,
      _didIteratorError = false,
      _iteratorError = void 0;
    try {
      for (var _iterator = sortedTokenKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        var sortedSubKeys = Object.keys(tokens[key]).sort();
        var _iteratorNormalCompletion1 = true,
          _didIteratorError1 = false,
          _iteratorError1 = void 0;
        try {
          for (var _iterator1 = sortedSubKeys[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
            var skey = _step1.value;
            var variable = tokens[key][skey];
            if (isWeb) {
              registerCSSVariable(variable);
              var variableNeedsPx = variable.needsPx === true;
              var categoryNeedsPx = shouldTokenCategoryHaveUnits(key);
              var shouldBeUnitless = !(variableNeedsPx || categoryNeedsPx);
              declarations.push(variableToCSS(variable, shouldBeUnitless));
            }
          }
        } catch (err) {
          _didIteratorError1 = true;
          _iteratorError1 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
              _iterator1.return();
            }
          } finally {
            if (_didIteratorError1) {
              throw _iteratorError1;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return declarations;
  }
  return [];
}
function createFontCSS(fontsParsed, registerFontVariables) {
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    var fontDeclarations = {};
    if (!fontsParsed) return fontDeclarations;
    var sortedFontKeys = Object.keys(fontsParsed).sort();
    var _iteratorNormalCompletion = true,
      _didIteratorError = false,
      _iteratorError = void 0;
    try {
      for (var _iterator = sortedFontKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        var fontParsed = fontsParsed[key];
        var [name, language] = key.includes("_") ? key.split("_") : [key];
        var fontVars = registerFontVariables(fontParsed);
        fontDeclarations[key] = {
          name: name.slice(1),
          declarations: fontVars,
          language,
          fontParsed
        };
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return fontDeclarations;
  }
  return {};
}
function buildCSSRuleSets(declarations, fontDeclarations) {
  var defaultFontToken = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "$true";
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    let declarationsToRuleSet2 = function (decs) {
      var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      return `:root${selector} {${sep}${[...decs].join(`;${sep}`)}
}`;
    };
    var declarationsToRuleSet = declarationsToRuleSet2;
    var cssRuleSets = [];
    var sep = " ";
    if (declarations.length) {
      cssRuleSets.push(declarationsToRuleSet2(declarations));
    }
    var fontSelectors = [];
    var sortedFontDeclarationKeys = Object.keys(fontDeclarations).sort();
    var _iteratorNormalCompletion = true,
      _didIteratorError = false,
      _iteratorError = void 0;
    try {
      for (var _iterator = sortedFontDeclarationKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;
        var {
          name,
          declarations: _$declarations,
          language = "default"
        } = fontDeclarations[key];
        var fontSelector = `.font_${name}`;
        fontSelectors.push(fontSelector);
        var langSelector = `:root .t_lang-${name}-${language} ${fontSelector}`;
        var selectors = language === "default" ? ` ${fontSelector}, ${langSelector}` : langSelector;
        var specificRuleSet = declarationsToRuleSet2(_$declarations, selectors);
        cssRuleSets.push(specificRuleSet);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    if (fontSelectors.length) {
      var firstFont = fontDeclarations[sortedFontDeclarationKeys[0]];
      if (firstFont === null || firstFont === void 0 ? void 0 : firstFont.fontParsed) {
        var fontProps = getFontPropertyDeclarations(firstFont.fontParsed, defaultFontToken);
        var sharedSelectors = [...fontSelectors, ".is_View"].join(", ");
        cssRuleSets.push(`${sharedSelectors} {${fontProps.join("; ")}}`);
      }
    }
    return cssRuleSets;
  }
  return [];
}
function createThemeCSS(dedupedThemes, configIn) {
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    var themeRuleSets = [];
    if (isWeb) {
      var _iteratorNormalCompletion = true,
        _didIteratorError = false,
        _iteratorError = void 0;
      try {
        for (var _iterator = dedupedThemes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var {
            names,
            theme
          } = _step.value;
          var nextRules = getThemeCSSRules({
            config: configIn,
            themeName: names[0],
            names,
            theme
          });
          themeRuleSets = [...themeRuleSets, ...nextRules];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    return themeRuleSets;
  }
  return [];
}
function getCSS(themeConfig) {
  var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    lastIndex = arguments.length > 2 ? arguments[2] : void 0;
  if (!process.env.GUI_DID_OUTPUT_CSS && false) {
    var {
      separator = "\n",
      sinceLastCall,
      exclude
    } = opts;
    if (sinceLastCall && lastIndex.value >= 0) {
      var rules = getAllRules();
      var newRules = rules.slice(lastIndex.value);
      lastIndex.value = rules.length;
      return newRules.join(separator);
    }
    lastIndex.value = 0;
    var runtimeStyles = getAllRules().join(separator);
    if (exclude === "design-system") {
      return runtimeStyles;
    }
    var themeRules = exclude ? "" : themeConfig.getThemeRulesSets().join(separator);
    var autoVarCSS = autoVariables.length ? `:root{${autoVariables.map(function (v) {
      return `--${v.name}:${v.val}`;
    }).join(";")}}` : "";
    var hideScrollBarsCSS = `._hsb-x::-webkit-scrollbar:horizontal { display: none !important; }
._hsb-y::-webkit-scrollbar:vertical { display: none !important; }
._hsb-x { scrollbar-width: none !important; }
._hsb-y { scrollbar-width: none !important; }`;
    var pointerEventsCSS = `:root ._pe-boxonly>* {pointer-events:none;}
:root ._pe-boxnone>* {pointer-events:auto;}`;
    var designSystem = `._ovs-contain {overscroll-behavior:contain;}
.t_unmounted .is_View, .t_unmounted .is_Text { transition: none !important; }
.is_View { display: flex; align-items: stretch; flex-direction: column; flex-basis: auto; box-sizing: border-box; min-height: 0; min-width: 0; flex-shrink: 0; }
.is_Text { display: inline; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap; margin: 0; }
@scope (.is_Text) to (.is_View) { .is_Text { white-space: inherit; word-wrap: inherit; } }
._dsp_contents {display:contents;}
._no_backdrop::backdrop {display: none;}
.is_Input::selection, .is_TextArea::selection {background-color: var(--selectionColor);}
.is_Input::placeholder, .is_TextArea::placeholder {color: var(--placeholderColor);}
${pointerEventsCSS}
${hideScrollBarsCSS}
${autoVarCSS}
${themeConfig.cssRuleSets.join(separator)}`;
    return `${designSystem}
${themeRules}
${runtimeStyles}`;
  }
  return "";
}
export { buildCSSRuleSets, createFontCSS, createThemeCSS, createTokenCSS, getCSS, getFontPropertyDeclarations };
//# sourceMappingURL=createDesignSystem.native.js.map
