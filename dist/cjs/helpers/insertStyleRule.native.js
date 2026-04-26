"use strict";

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
var insertStyleRule_exports = {};
__export(insertStyleRule_exports, {
  getAllRules: () => getAllRules,
  getAllSelectors: () => getAllSelectors,
  insertStyleRules: () => insertStyleRules,
  scanAllSheets: () => scanAllSheets,
  setNonce: () => setNonce,
  shouldInsertStyleRules: () => shouldInsertStyleRules,
  stopAccumulatingRules: () => stopAccumulatingRules,
  updateRules: () => updateRules
});
module.exports = __toCommonJS(insertStyleRule_exports);
var import_helpers = require("@hanzogui/helpers");
var import_createVariable = require("../createVariable.native.js");
function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}
var scannedCache = /* @__PURE__ */new WeakMap();
var totalSelectorsInserted = /* @__PURE__ */new Map();
var allSelectors = {};
var allRules = {};
var getAllSelectors = function () {
  return allSelectors;
};
var getAllRules = function () {
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    var sortedKeys = Object.keys(allRules).sort();
    return sortedKeys.map(function (key) {
      return allRules[key];
    });
  }
  return [];
};
var lastScannedSheets = null;
function scanAllSheets() {
  var collectThemes = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false,
    tokens = arguments.length > 1 ? arguments[1] : void 0;
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    if (process.env.NODE_ENV === "test") return;
    if (true) return;
    var themes;
    var sheets = document.styleSheets || [];
    var prev = lastScannedSheets;
    var current = new Set(sheets);
    var _iteratorNormalCompletion = true,
      _didIteratorError = false,
      _iteratorError = void 0;
    try {
      for (var _iterator = current[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sheet2 = _step.value;
        if (sheet2) {
          var out = updateSheetStyles(sheet2, false, collectThemes, tokens);
          if (out) {
            themes = out;
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
    lastScannedSheets = current;
    if (prev) {
      var _iteratorNormalCompletion1 = true,
        _didIteratorError1 = false,
        _iteratorError1 = void 0;
      try {
        for (var _iterator1 = prev[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
          var sheet1 = _step1.value;
          if (sheet1 && !current.has(sheet1)) {
            updateSheetStyles(sheet1, true);
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
    return themes;
  }
}
function trackInsertedStyle(id) {
  var next = (totalSelectorsInserted.get(id) || 0) + 1;
  totalSelectorsInserted.set(id, next);
  return next;
}
var bailAfterEnv = process.env.GUI_BAIL_AFTER_SCANNING_X_CSS_RULES;
var bailAfter = bailAfterEnv ? +bailAfterEnv : 8e3;
function updateSheetStyles(sheet2) {
  var remove = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false,
    collectThemes = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false,
    tokens = arguments.length > 3 ? arguments[3] : void 0;
  var _getGuiSelector, _getGuiSelector1;
  var rules;
  try {
    rules = sheet2.cssRules;
    if (!rules) {
      return;
    }
  } catch (e) {
    return;
  }
  var firstSelector = (_getGuiSelector = getGuiSelector(rules[0], collectThemes)) === null || _getGuiSelector === void 0 ? void 0 : _getGuiSelector[0];
  var lastSelector = (_getGuiSelector1 = getGuiSelector(rules[rules.length - 1], collectThemes)) === null || _getGuiSelector1 === void 0 ? void 0 : _getGuiSelector1[0];
  var cacheKey = `${rules.length}${firstSelector}${lastSelector}`;
  var lastScanned = scannedCache.get(sheet2);
  if (!remove) {
    if (lastScanned === cacheKey) {
      return;
    }
  }
  var len = rules.length;
  var fails = 0;
  var dedupedThemes;
  var nameToTheme = {};
  for (var i = 0; i < len; i++) {
    var rule = rules[i];
    if (!_instanceof(rule, CSSStyleRule)) continue;
    var response = getGuiSelector(rule, collectThemes);
    if (response) {
      fails = 0;
    } else {
      fails++;
      if (fails > bailAfter) {
        return;
      }
      continue;
    }
    var [identifier, cssRule, isTheme] = response;
    if (isTheme) {
      var deduped = addThemesFromCSS(cssRule, tokens);
      if (deduped) {
        var _iteratorNormalCompletion = true,
          _didIteratorError = false,
          _iteratorError = void 0;
        try {
          var _loop = function () {
            var name = _step.value;
            if (nameToTheme[name]) {
              Object.apply(nameToTheme[name], deduped.theme);
              deduped.names = deduped.names.filter(function (x) {
                return x !== name;
              });
            } else {
              nameToTheme[name] = deduped.theme;
            }
          };
          for (var _iterator = deduped.names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) _loop();
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
        dedupedThemes || (dedupedThemes = []);
        dedupedThemes.push(deduped);
      }
      continue;
    }
  }
  scannedCache.set(sheet2, cacheKey);
  return dedupedThemes;
}
var colorVarToVal;
var rootComputedStyle = null;
function addThemesFromCSS(cssStyleRule, tokens) {
  var selectors = cssStyleRule.selectorText.split(",");
  if (!selectors.length) return;
  if ((tokens === null || tokens === void 0 ? void 0 : tokens.color) && !colorVarToVal) {
    colorVarToVal = {};
    for (var key in tokens.color) {
      var token = tokens.color[key];
      if (token) {
        colorVarToVal[token.name] = token.val;
      }
    }
  }
  var rulesWithBraces = (cssStyleRule.cssText || "").slice(cssStyleRule.selectorText.length + 2, -1);
  var rules = rulesWithBraces.split(";");
  var values = {};
  var _iteratorNormalCompletion = true,
    _didIteratorError = false,
    _iteratorError = void 0;
  try {
    for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rule = _step.value;
      var sepI = rule.indexOf(":");
      if (sepI === -1) continue;
      var varIndex = rule.indexOf("--");
      var key1 = rule.slice(varIndex === -1 ? 0 : varIndex + 2, sepI);
      if (process.env.GUI_CSS_VARIABLE_PREFIX) {
        key1 = key1.replace(process.env.GUI_CSS_VARIABLE_PREFIX, "");
      }
      var val = rule.slice(sepI + 2);
      var value = void 0;
      if (val[0] === "v" && val.startsWith("var(")) {
        var varName = val.slice(6, -1);
        var tokenVal = colorVarToVal === null || colorVarToVal === void 0 ? void 0 : colorVarToVal[varName];
        if (tokenVal) {
          value = tokenVal;
        } else {
          rootComputedStyle || (rootComputedStyle = getComputedStyle(document.body));
          value = rootComputedStyle.getPropertyValue("--" + varName);
        }
      } else {
        value = val;
      }
      values[key1] = (0, import_createVariable.createVariable)({
        key: key1,
        name: key1,
        val: value
      }, true);
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
  var names = /* @__PURE__ */new Set();
  var _iteratorNormalCompletion1 = true,
    _didIteratorError1 = false,
    _iteratorError1 = void 0;
  try {
    for (var _iterator1 = selectors[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
      var selector = _step1.value;
      if (selector === " .tm_xxt") continue;
      var lastThemeSelectorIndex = selector.lastIndexOf(".t_");
      var name = selector.slice(lastThemeSelectorIndex).slice(3);
      var [schemeChar] = selector[lastThemeSelectorIndex - 5];
      var scheme = schemeChar === "d" ? "dark" : schemeChar === "i" ? "light" : "";
      var themeName = scheme && scheme !== name ? `${scheme}_${name}` : name;
      if (!themeName || themeName === "light_dark" || themeName === "dark_light") {
        continue;
      }
      names.add(themeName);
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
  return {
    names: [...names],
    theme: values
  };
}
var guiSelectorRegex = /\.tm_xxt/;
function getGuiSelector(rule) {
  var collectThemes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  if (_instanceof(rule, CSSStyleRule)) {
    var text = rule.selectorText;
    if (text[0] === ":" && text[1] === "r" && guiSelectorRegex.test(text)) {
      var id = getIdentifierFromGuiSelector(
      // next.js minifies it so its in front
      text.replace(guiSelectorRegex, ""));
      return collectThemes ? [id, rule, true] : [id, rule];
    }
  } else if (_instanceof(rule, CSSMediaRule)) {
    if (rule.cssRules.length > 1) return;
    return getGuiSelector(rule.cssRules[0]);
  }
}
var getIdentifierFromGuiSelector = function (selector) {
  var dotIndex = selector.indexOf(":");
  if (dotIndex > -1) {
    return selector.slice(7, dotIndex);
  }
  return selector.slice(7);
};
var sheet = null;
var trackAllRules = true;
function stopAccumulatingRules() {
  trackAllRules = false;
}
function updateRules(identifier, rules) {
  if (trackAllRules) {
    allRules[identifier] = rules.join(" ");
  }
  return true;
}
var nonce = "";
function setNonce(_) {
  nonce = _;
}
function insertStyleRules(rulesToInsert) {
  if (true) return;
  if (!sheet && document.head) {
    var styleTag = document.createElement("style");
    styleTag.id = "_gui-styles";
    if (nonce) {
      styleTag.nonce = nonce;
    }
    sheet = document.head.appendChild(styleTag).sheet;
  }
  if (!sheet) return;
  for (var key in rulesToInsert) {
    var styleObject = rulesToInsert[key];
    var identifier = styleObject[import_helpers.StyleObjectIdentifier];
    if (!shouldInsertStyleRules(identifier)) {
      continue;
    }
    var rules = styleObject[import_helpers.StyleObjectRules];
    allSelectors[identifier] = rules.join("\n");
    trackInsertedStyle(identifier);
    updateRules(identifier, rules);
    try {
      var _iteratorNormalCompletion = true,
        _didIteratorError = false,
        _iteratorError = void 0;
      try {
        for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rule = _step.value;
          sheet.insertRule(rule, sheet.cssRules.length);
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
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error(`Error inserting style rule`, rules);
      }
    }
  }
}
var maxToInsert = process.env.GUI_INSERT_SELECTOR_TRIES ? +process.env.GUI_INSERT_SELECTOR_TRIES : 1;
function shouldInsertStyleRules(identifier) {
  if (process.env.IS_STATIC === "is_static") {
    return true;
  }
  var total = totalSelectorsInserted.get(identifier) || 0;
  if (process.env.NODE_ENV === "development") {
    if (total > +(process.env.GUI_STYLE_INSERTION_WARNING_LIMIT || 10)) {
      console.warn(`Warning: inserting many CSS rules, you may be animating something and generating many CSS insertions, which can degrade performance. Instead, try using the "disableClassName" property on elements that change styles often. To disable this warning set GUI_STYLE_INSERTION_WARNING_LIMIT from 50000 to something higher`);
    }
  }
  return total < maxToInsert;
}
//# sourceMappingURL=insertStyleRule.native.js.map
