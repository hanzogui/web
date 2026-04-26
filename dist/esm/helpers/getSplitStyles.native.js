import { isAndroid, isClient, isIos, isWeb, useIsomorphicLayoutEffect } from "@hanzogui/constants";
import { StyleObjectIdentifier, StyleObjectProperty, StyleObjectPseudo, StyleObjectRules, nonAnimatableStyleProps, stylePropsText, stylePropsTransform, tokenCategories, validPseudoKeys, validStyles as validStylesView } from "@hanzogui/helpers";
import React from "react";
import { getConfig, getFont, getSetting } from "../config.native.js";
import { isDevTools } from "../constants/isDevTools.native.js";
import { getMediaImportanceIfMoreImportant, getMediaKey, getMediaKeyImportance, mediaKeyMatch } from "../hooks/useMedia.native.js";
import { mediaState as globalMediaState, mediaQueryConfig } from "./mediaState.native.js";
import { createMediaStyle } from "./createMediaStyle.native.js";
import { fixStyles } from "./expandStyles.native.js";
import { getCSSStylesAtomic, getStyleAtomic, styleToCSS } from "./getCSSStylesAtomic.native.js";
import { getDefaultProps } from "./getDefaultProps.native.js";
import { extractValueFromDynamic, getDynamicVal, getOppositeScheme, isColorStyleKey } from "./getDynamicVal.native.js";
import { getGroupPropParts } from "./getGroupPropParts.native.js";
import { insertStyleRules, shouldInsertStyleRules, updateRules } from "./insertStyleRule.native.js";
import { isActivePlatform, getPlatformSpecificityBump } from "./isActivePlatform.native.js";
import { isActiveTheme } from "./isActiveTheme.native.js";
import { log } from "./log.native.js";
import { normalizeValueWithProperty } from "./normalizeValueWithProperty.native.js";
import { propMapper } from "./propMapper.native.js";
import { pseudoDescriptors, pseudoPriorities, defaultMediaImportance } from "./pseudoDescriptors.native.js";
import { skipProps } from "./skipProps.native.js";
import { sortString } from "./sortString.native.js";
import { transformsToString } from "./transformsToString.native.js";
function _type_of(obj) {
  "@swc/helpers - typeof";

  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var conf;
var styleOriginalValues = /* @__PURE__ */new WeakMap();
var PROP_SPLIT = "-";
function normalizeGroupKey(key, groupContext) {
  var parts = key.split("-");
  var plen = parts.length;
  if (
  // check if its actually a simple group selector to avoid breaking selectors
  plen === 2 || plen === 3 && pseudoPriorities[parts[parts.length - 1]]) {
    var name = parts[1];
    if (name !== "true" && groupContext && !groupContext[name]) {
      return key.replace("$group-", "$group-true-");
    }
  }
  return key;
}
function isValidStyleKey(key, validStyles, accept) {
  return key in validStyles ? true : accept && key in accept;
}
var getSplitStyles = function (props, staticConfig, theme, themeName, componentState, styleProps, parentSplitStyles, componentContext, groupContext, elementType, startedUnhydrated, debug, animationDriver) {
  var _loop = function (keyOg2) {
    var keyInit = keyOg2;
    var valInit = props[keyInit];
    if (keyInit === "children") {
      viewProps[keyInit] = valInit;
      return "continue";
    }
    if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
      time`before-prop-${keyInit}`;
    }
    if (process.env.NODE_ENV === "test" && keyInit === "jestAnimatedStyle") {
      return "continue";
    }
    if (accept) {
      var accepted = accept[keyInit];
      if ((accepted === "style" || accepted === "textStyle") && valInit && (typeof valInit === "undefined" ? "undefined" : _type_of(valInit)) === "object") {
        viewProps[keyInit] = getSubStyle(styleState, keyInit, valInit, styleProps.noClass);
        return "continue";
      }
    }
    if (!disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit];
      }
    }
    if (keyInit === "className") return "continue";
    if (asChild) {
      var defaults = getDefaultProps(staticConfig);
      if (defaults) {
        var _defaults_keyOg;
        var defaultVal = (_defaults_keyOg = defaults[keyOg2]) !== null && _defaults_keyOg !== void 0 ? _defaults_keyOg : defaults[keyInit];
        if (defaultVal !== void 0 && valInit === defaultVal) {
          return "continue";
        }
      }
    }
    if (keyInit in skipProps && !noSkip && !isHOC) {
      var _driver_animations;
      if (keyInit === "group") {
        if (false) {
          var identifier2 = `t_group_${valInit}`;
          var containerType = webContainerType || "inline-size";
          var containerCSS = ["container", void 0, identifier2, void 0, [`.${identifier2} { container-name: ${valInit}; container-type: ${containerType}; }`]];
          addStyleToInsertRules(rulesToInsert, containerCSS);
        }
      }
      if (keyInit === "transition" && typeof valInit === "string" && !(driver === null || driver === void 0 ? void 0 : (_driver_animations = driver.animations) === null || _driver_animations === void 0 ? void 0 : _driver_animations[valInit])) {} else {
        return "continue";
      }
    }
    var isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept);
    if (false) {
      if (staticConfig.isReactNative && keyInit.startsWith("data-")) {
        var _viewProps2, _dataSet;
        keyInit = keyInit.replace("data-", "");
        (_viewProps2 = viewProps)[_dataSet = "dataSet"] || (_viewProps2[_dataSet] = {});
        viewProps["dataSet"][keyInit] = valInit;
        return "continue";
      }
    }
    if (true) {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          if (keyInit === "elevationAndroid") return "continue";
        }
        if (keyInit === "userSelect") {
          keyInit = "selectable";
          valInit = valInit !== "none";
        } else if (keyInit.startsWith("data-")) {
          return "continue";
        }
      }
    }
    if (false) {
      if (!noExpand) {
        if (keyInit === "disabled" && valInit === true) {
          viewProps["aria-disabled"] = true;
          if (elementType === "button" || elementType === "form" || elementType === "input" || elementType === "select" || elementType === "textarea") {
            viewProps.disabled = true;
          }
          if (!(variants === null || variants === void 0 ? void 0 : variants.disabled)) {
            return "continue";
          }
        }
        if (keyInit === "testID") {
          if (isReactNative) {
            viewProps.testID = valInit;
          } else {
            viewProps["data-testid"] = valInit;
            if (styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.isReactNative)) {
              viewProps.testID = valInit;
            }
          }
          return "continue";
        }
        if (keyInit === "id") {
          viewProps.id = valInit;
          return "continue";
        }
      }
    }
    var isVariant = !isValidStyleKeyInit && variants && keyInit in variants;
    var isStyleLikeKey = isValidStyleKeyInit || isVariant;
    var isPseudo = keyInit in validPseudoKeys;
    var isMedia = !isStyleLikeKey && !isPseudo ? getMediaKey(keyInit) : false;
    var isMediaOrPseudo = Boolean(isMedia || isPseudo);
    if (isMediaOrPseudo && isMedia === "group") {
      keyInit = normalizeGroupKey(keyInit, groupContext);
    }
    var isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || isVariant && !noExpand;
    if (isStyleProp && (asChild === "except-style" || asChild === "except-style-web")) {
      return "continue";
    }
    var shouldPassProp = !isStyleProp && isHOC ||
    // is in parent variants
    isHOC && parentVariants && keyInit in parentVariants || (inlineProps === null || inlineProps === void 0 ? void 0 : inlineProps.has(keyInit));
    var parentVariant = parentVariants === null || parentVariants === void 0 ? void 0 : parentVariants[keyInit];
    var isHOCShouldPassThrough = Boolean(isHOC && (isValidStyleKeyInit || isMediaOrPseudo || parentVariant || keyInit in skipProps));
    var shouldPassThrough = shouldPassProp || isHOCShouldPassThrough;
    if (process.env.NODE_ENV === "development" && debug === "verbose") {
      console.groupCollapsed(`  \u{1F511} ${keyOg2}${keyInit !== keyOg2 ? ` (shorthand for ${keyInit})` : ""} ${shouldPassThrough ? "(pass)" : ""}`);
      log({
        isVariant,
        valInit,
        shouldPassProp
      });
      if (isClient) {
        log({
          variants,
          variant: variants === null || variants === void 0 ? void 0 : variants[keyInit],
          isVariant,
          isHOCShouldPassThrough,
          usedKeys: {
            ...styleState.usedKeys
          },
          parentStaticConfig
        });
      }
    }
    if (shouldPassThrough) {
      passDownProp(viewProps, keyInit, valInit, isMediaOrPseudo);
      if (process.env.NODE_ENV === "development" && debug === "verbose") {
        console.groupEnd();
      }
      if (!isVariant) {
        return "continue";
      }
    }
    if (!noSkip) {
      var _driver_animations1;
      if (keyInit in skipProps && !(keyInit === "transition" && typeof valInit === "string" && !(driver === null || driver === void 0 ? void 0 : (_driver_animations1 = driver.animations) === null || _driver_animations1 === void 0 ? void 0 : _driver_animations1[valInit]))) {
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          console.groupEnd();
        }
        return "continue";
      }
    }
    if (isText || isInput) {
      if (valInit && (keyInit === "fontFamily" || keyInit === shorthands["fontFamily"]) && valInit in conf.fontsParsed) {
        styleState.fontFamily = valInit;
      }
    }
    var disablePropMap = isMediaOrPseudo || !isStyleLikeKey;
    propMapper(keyInit, valInit, styleState, disablePropMap, function (key5, val2, originalVal) {
      var _parentStaticConfig_variants;
      var isStyledContextProp = styledContext && key5 in styledContext;
      if (!isHOC && disablePropMap && !isStyledContextProp && !isMediaOrPseudo) {
        viewProps[key5] = val2;
        return;
      }
      if (process.env.NODE_ENV === "development" && debug === "verbose") {
        console.groupCollapsed("  \u{1F4A0} expanded", keyInit, "=>", key5);
        log(val2);
        console.groupEnd();
      }
      if (val2 == null) return;
      if (true) {
        if (key5 === "pointerEvents") {
          viewProps[key5] = val2;
          return;
        }
      }
      if (!isHOC && isValidStyleKey(key5, validStyles, accept) || isAndroid && key5 === "elevation") {
        mergeStyle(styleState, key5, val2, 1, false, originalVal);
        return;
      }
      isPseudo = key5 in validPseudoKeys;
      isMedia = isPseudo ? false : getMediaKey(key5);
      isMediaOrPseudo = Boolean(isMedia || isPseudo);
      isVariant = variants && key5 in variants;
      if (isMedia === "group") {
        key5 = normalizeGroupKey(key5, groupContext);
      }
      if ((inlineProps === null || inlineProps === void 0 ? void 0 : inlineProps.has(key5)) || process.env.IS_STATIC === "is_static" && (inlineWhenUnflattened === null || inlineWhenUnflattened === void 0 ? void 0 : inlineWhenUnflattened.has(key5))) {
        var _props_key;
        viewProps[key5] = (_props_key = props[key5]) !== null && _props_key !== void 0 ? _props_key : val2;
      }
      var shouldPassThrough2 = styleProps.noExpand && isPseudo || isHOC && (isMediaOrPseudo || (parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : (_parentStaticConfig_variants = parentStaticConfig.variants) === null || _parentStaticConfig_variants === void 0 ? void 0 : _parentStaticConfig_variants[keyInit]));
      if (shouldPassThrough2) {
        passDownProp(viewProps, key5, val2, isMediaOrPseudo);
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          console.groupCollapsed(` - passing down prop ${key5}`);
          log({
            val: val2,
            after: {
              ...viewProps[key5]
            }
          });
          console.groupEnd();
        }
        return;
      }
      if (isPseudo) {
        if (!val2) return;
        var pseudoStyleObject = getSubStyle(styleState, key5, val2, styleProps.noClass && !(process.env.IS_STATIC === "is_static"));
        if (!shouldDoClasses || process.env.IS_STATIC === "is_static") {
          var _pseudos, _key;
          pseudos || (pseudos = {});
          (_pseudos = pseudos)[_key = key5] || (_pseudos[_key] = {});
          if (process.env.IS_STATIC === "is_static") {
            Object.assign(pseudos[key5], pseudoStyleObject);
            return;
          }
        }
        var descriptor = pseudoDescriptors[key5];
        var isEnter = key5 === "enterStyle";
        var isExit = key5 === "exitStyle";
        if (!descriptor) {
          return;
        }
        if (shouldDoClasses && !isExit) {
          var pseudoStyles = getStyleAtomic(pseudoStyleObject, descriptor);
          if (process.env.NODE_ENV === "development" && debug === "verbose") {
            console.info("pseudo:", key5, pseudoStyleObject, pseudoStyles);
          }
          var _iteratorNormalCompletion3 = true,
            _didIteratorError3 = false,
            _iteratorError3 = void 0;
          try {
            for (var _iterator3 = pseudoStyles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var psuedoStyle = _step3.value;
              var fullKey = `${psuedoStyle[StyleObjectProperty]}${PROP_SPLIT}${descriptor.name}`;
              addStyleToInsertRules(rulesToInsert, psuedoStyle);
              classNames[fullKey] = psuedoStyle[StyleObjectIdentifier];
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
        if (!shouldDoClasses || isExit || isEnter) {
          var descriptorKey = descriptor.stateKey || descriptor.name;
          var isDisabled = componentState[descriptorKey] === false;
          if (isExit) {
            isDisabled = !styleProps.isExiting;
          }
          if (isEnter && componentState.unmounted === false) {
            isDisabled = true;
          }
          if (process.env.NODE_ENV === "development" && debug === "verbose") {
            console.groupCollapsed("pseudo", key5, {
              isDisabled
            });
            log({
              pseudoStyleObject,
              isDisabled,
              descriptor,
              componentState
            });
            console.groupEnd();
          }
          var importance = descriptor.priority;
          var pseudoOriginalValues = styleOriginalValues.get(pseudoStyleObject);
          for (var pkey in pseudoStyleObject) {
            var _$val = pseudoStyleObject[pkey];
            if (isDisabled) {
              applyDefaultStyle(pkey, styleState);
            } else {
              var curImportance = styleState.usedKeys[pkey] || 0;
              var shouldMerge = importance >= curImportance;
              if (shouldMerge) {
                if (process.env.IS_STATIC === "is_static") {
                  var _pseudos1, _key1;
                  pseudos || (pseudos = {});
                  (_pseudos1 = pseudos)[_key1 = key5] || (_pseudos1[_key1] = {});
                  pseudos[key5][pkey] = _$val;
                }
                mergeStyle(styleState, pkey, _$val, importance, false, pseudoOriginalValues === null || pseudoOriginalValues === void 0 ? void 0 : pseudoOriginalValues[pkey]);
              }
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log("    subKey", pkey, shouldMerge, {
                  importance,
                  curImportance,
                  pkey,
                  val: _$val
                });
              }
            }
          }
          if (!isDisabled) {
            for (var _$key in val2) {
              var k = shorthands[_$key] || _$key;
              styleState.usedKeys[k] = Math.max(importance, styleState.usedKeys[k] || 0);
            }
          }
        }
        return;
      }
      if (isMedia) {
        if (!val2) return;
        var mediaKeyShort = key5.slice(isMedia == "theme" ? 7 : 1);
        hasMedia || (hasMedia = true);
        var hasSpace = val2["space"];
        if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
          if (!hasMedia || typeof hasMedia === "boolean") {
            hasMedia = /* @__PURE__ */new Set();
          }
          hasMedia.add(mediaKeyShort);
        }
        if (isMedia === "platform") {
          if (!isActivePlatform(key5)) {
            return;
          }
        }
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          log(`  \u{1F4FA} ${key5}`, {
            key: key5,
            val: val2,
            props,
            shouldDoClasses,
            acceptsClassName,
            componentState,
            mediaState
          });
        }
        var priority = mediaStylesSeen;
        mediaStylesSeen += 1;
        if (shouldDoClasses) {
          var mediaStyle = getSubStyle(styleState, key5, val2, false);
          var mediaStyles = getCSSStylesAtomic(mediaStyle);
          var _iteratorNormalCompletion12 = true,
            _didIteratorError12 = false,
            _iteratorError12 = void 0;
          try {
            for (var _iterator12 = mediaStyles[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var style3 = _step12.value;
              var property = style3[StyleObjectProperty];
              var isSubStyle = property[0] === "$";
              if (isSubStyle && !isActivePlatform(property)) {
                continue;
              }
              var out = createMediaStyle(style3, mediaKeyShort, mediaQueryConfig, isMedia, false, priority);
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(`\u{1F4FA} media style:`, out);
              }
              var subKey = isSubStyle ? style3[2] : "";
              var fullKey1 = `${style3[StyleObjectProperty]}${subKey}${PROP_SPLIT}${mediaKeyShort}${style3[StyleObjectPseudo] || ""}`;
              addStyleToInsertRules(rulesToInsert, out);
              classNames[fullKey1] = out[StyleObjectIdentifier];
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }
        } else {
          let mergeMediaStyle2 = function (key6, val3, originalVal2) {
            var _styleState4;
            if (process.env.TAMAGUI_TARGET === "native") {
              if (!isValidStyleKey(key6, validStyles, accept)) {
                viewProps[key6] = val3;
                return;
              }
            }
            (_styleState4 = styleState).style || (_styleState4.style = {});
            var didMerge = mergeMediaByImportance(styleState, mediaKeyShort, key6, val3, mediaState[mediaKeyShort], importanceBump, debug, originalVal2);
            if (didMerge && key6 === "fontFamily") {
              styleState.fontFamily = mediaStyle1.fontFamily;
            }
          };
          var mergeMediaStyle = mergeMediaStyle2;
          var isThemeMedia = isMedia === "theme";
          var isGroupMedia = isMedia === "group";
          var isPlatformMedia = isMedia === "platform";
          if (!isThemeMedia && !isPlatformMedia && !isGroupMedia) {
            if (!mediaState[mediaKeyShort]) {
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(`  \u{1F4FA} \u274C DISABLED ${mediaKeyShort}`);
              }
              return;
            }
            if (process.env.NODE_ENV === "development" && debug === "verbose") {
              log(`  \u{1F4FA} \u2705 ENABLED ${mediaKeyShort}`);
            }
          }
          var mediaStyle1 = getSubStyle(styleState, key5, val2, true);
          var importanceBump = 0;
          if (isThemeMedia) {
            if (isIos && getSetting("fastSchemeChange")) {
              var _styleState3;
              (_styleState3 = styleState).style || (_styleState3.style = {});
              var scheme = mediaKeyShort;
              var oppositeScheme = getOppositeScheme(mediaKeyShort);
              var themeOriginalValues = styleOriginalValues.get(mediaStyle1);
              var isCurrentScheme = themeName === scheme || themeName.startsWith(scheme);
              for (var subKey1 in mediaStyle1) {
                var _$val1 = extractValueFromDynamic(mediaStyle1[subKey1], scheme);
                var existing = styleState.style[subKey1];
                if (!isColorStyleKey(subKey1)) {
                  dynamicThemeAccess = true;
                  if (isCurrentScheme) {
                    mediaStyle1[subKey1] = _$val1;
                  } else {
                    delete mediaStyle1[subKey1];
                  }
                  continue;
                }
                if (existing === null || existing === void 0 ? void 0 : existing.dynamic) {
                  existing.dynamic[scheme] = _$val1;
                  mediaStyle1[subKey1] = existing;
                } else {
                  var oppositeVal = extractValueFromDynamic(existing, oppositeScheme);
                  mediaStyle1[subKey1] = getDynamicVal({
                    scheme,
                    val: _$val1,
                    oppositeVal
                  });
                  mergeStyle(styleState, subKey1, mediaStyle1[subKey1], priority, false, themeOriginalValues === null || themeOriginalValues === void 0 ? void 0 : themeOriginalValues[subKey1]);
                }
              }
            } else {
              dynamicThemeAccess = true;
              if (!(themeName === mediaKeyShort || themeName.startsWith(mediaKeyShort))) {
                return;
              }
            }
          } else if (isGroupMedia) {
            var _groupContext_groupName, _componentState_group;
            var groupInfo = getGroupPropParts(mediaKeyShort);
            var groupName = groupInfo.name;
            var groupState = groupContext === null || groupContext === void 0 ? void 0 : (_groupContext_groupName = groupContext[groupName]) === null || _groupContext_groupName === void 0 ? void 0 : _groupContext_groupName.state;
            var groupPseudoKey = groupInfo.pseudo;
            var groupMediaKey = groupInfo.media;
            if (!groupState) {
              if (process.env.NODE_ENV === "development" && debug) {
                log(`No parent with group prop, skipping styles: ${groupName}`);
              }
              pseudoGroups || (pseudoGroups = /* @__PURE__ */new Set());
              return;
            }
            var componentGroupState = (_componentState_group = componentState.group) === null || _componentState_group === void 0 ? void 0 : _componentState_group[groupName];
            if (groupMediaKey) {
              mediaGroups || (mediaGroups = /* @__PURE__ */new Set());
              mediaGroups.add(groupMediaKey);
              var mediaState1 = componentGroupState === null || componentGroupState === void 0 ? void 0 : componentGroupState.media;
              var isActive = mediaState1 === null || mediaState1 === void 0 ? void 0 : mediaState1[groupMediaKey];
              if (!mediaState1 && groupState.layout) {
                isActive = mediaKeyMatch(groupMediaKey, groupState.layout);
              }
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(` \u{1F3D8}\uFE0F GROUP media ${groupMediaKey} active? ${isActive}`, {
                  ...mediaState1,
                  usedKeys: {
                    ...styleState.usedKeys
                  }
                });
              }
              if (!isActive) {
                for (var pkey1 in mediaStyle1) {
                  applyDefaultStyle(pkey1, styleState);
                }
                return;
              }
              importanceBump = 2;
            }
            if (groupPseudoKey) {
              var _this;
              pseudoGroups || (pseudoGroups = /* @__PURE__ */new Set());
              pseudoGroups.add(groupName);
              var componentGroupPseudoState = (_this = componentGroupState || (
              // fallback to context initially
              groupContext === null || groupContext === void 0 ? void 0 : groupContext[groupName].state)) === null || _this === void 0 ? void 0 : _this.pseudo;
              var isActive1 = componentGroupPseudoState === null || componentGroupPseudoState === void 0 ? void 0 : componentGroupPseudoState[groupPseudoKey];
              var priority1 = pseudoPriorities[groupPseudoKey];
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(` \u{1F3D8}\uFE0F GROUP pseudo ${groupMediaKey} active? ${isActive1}, priority ${priority1}`, {
                  componentGroupPseudoState: {
                    ...componentGroupPseudoState
                  },
                  usedKeys: {
                    ...styleState.usedKeys
                  }
                });
              }
              if (!isActive1) {
                for (var pkey2 in mediaStyle1) {
                  applyDefaultStyle(pkey2, styleState);
                }
                return;
              }
              importanceBump = priority1;
            }
          } else if (isPlatformMedia) {
            importanceBump = getPlatformSpecificityBump(mediaKeyShort);
          }
          var mediaOriginalValues = styleOriginalValues.get(mediaStyle1);
          if (isGroupMedia && mediaStyle1.transition) {
            var _styleState12;
            (_styleState12 = styleState).pseudoTransitions || (_styleState12.pseudoTransitions = {});
            styleState.pseudoTransitions[`$${mediaKeyShort}`] = mediaStyle1.transition;
          }
          for (var subKey2 in mediaStyle1) {
            if (subKey2 === "space") {
              continue;
            }
            if (subKey2[0] === "$") {
              var subMediaType = getMediaKey(subKey2);
              if (subMediaType === "platform") {
                if (!isActivePlatform(subKey2)) continue;
              } else if (subMediaType === "theme") {
                if (!isActiveTheme(subKey2, themeName)) continue;
              } else if (subMediaType === true) {
                var subKeyShort = subKey2.slice(1);
                if (!mediaState[subKeyShort]) continue;
              }
              var nestedVal = mediaStyle1[subKey2];
              var subOriginalValues = styleOriginalValues.get(nestedVal);
              var isSizeMediaKey = !!mediaState[mediaKeyShort];
              var outerBase = isSizeMediaKey ? getMediaKeyImportance(mediaKeyShort) : defaultMediaImportance;
              var innerBase = void 0;
              if (subMediaType === "platform") {
                innerBase = defaultMediaImportance + getPlatformSpecificityBump(subKey2.slice(1));
              } else if (subMediaType === true) {
                innerBase = getMediaKeyImportance(subKey2.slice(1));
              } else {
                innerBase = defaultMediaImportance;
              }
              var nestedImportance = outerBase + importanceBump + innerBase + 1;
              for (var subSubKey in nestedVal) {
                var _styleState22;
                var expandedKey = shorthands[subSubKey] || subSubKey;
                var {
                  usedKeys
                } = styleState;
                if (usedKeys[expandedKey] && usedKeys[expandedKey] > nestedImportance) {
                  continue;
                }
                (_styleState22 = styleState).style || (_styleState22.style = {});
                mergeStyle(styleState, expandedKey, nestedVal[subSubKey], nestedImportance, false, subOriginalValues === null || subOriginalValues === void 0 ? void 0 : subOriginalValues[subSubKey]);
                if (expandedKey === "fontFamily") {
                  styleState.fontFamily = nestedVal[subSubKey];
                }
              }
            } else {
              mergeMediaStyle2(subKey2, mediaStyle1[subKey2], mediaOriginalValues === null || mediaOriginalValues === void 0 ? void 0 : mediaOriginalValues[subKey2]);
            }
          }
        }
        return;
      }
      if (!isVariant) {
        if (isStyledContextProp) {
          return;
        }
        viewProps[key5] = val2;
      }
    });
    if (process.env.NODE_ENV === "development" && debug === "verbose") {
      try {
        log(` \u2714\uFE0F expand complete`, keyInit);
        log("style", {
          ...styleState.style
        });
        log("viewProps", {
          ...viewProps
        });
        log("transforms", {
          ...styleState.flatTransforms
        });
      } catch (e) {}
      console.groupEnd();
    }
  };
  conf = conf || getConfig();
  var driver = animationDriver || (componentContext === null || componentContext === void 0 ? void 0 : componentContext.animationDriver) || conf.animations;
  if (props.passThrough) {
    return null;
  }
  if (isWeb && styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.isReactNative) && !styleProps.noNormalize) {
    styleProps.noNormalize = "values";
  }
  var {
    shorthands
  } = conf;
  var {
    isHOC,
    isText,
    isInput,
    variants,
    isReactNative,
    inlineProps,
    inlineWhenUnflattened,
    parentStaticConfig,
    acceptsClassName
  } = staticConfig;
  var viewProps = {};
  var mediaState = styleProps.mediaState || globalMediaState;
  var shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass;
  var rulesToInsert = true ? void 0 : {};
  var classNames = {};
  var space = props.space;
  var pseudos = null;
  var hasMedia = false;
  var dynamicThemeAccess;
  var pseudoGroups;
  var mediaGroups;
  var className = props.className || "";
  var mediaStylesSeen = 0;
  var validStyles = staticConfig.validStyles || (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView);
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-setup`;
  }
  var styleState = {
    classNames,
    conf,
    props,
    styleProps,
    componentState,
    staticConfig,
    style: null,
    theme,
    usedKeys: {},
    viewProps,
    context: componentContext,
    debug,
    // resolved animation driver (respects animatedBy prop)
    animationDriver: driver
  };
  if (process.env.IS_STATIC === "is_static") {
    var {
      fallbackProps
    } = styleProps;
    if (fallbackProps) {
      styleState.props = new Proxy(props, {
        get(_, key5, val2) {
          if (!Reflect.has(props, key5)) {
            return Reflect.get(fallbackProps, key5);
          }
          return Reflect.get(props, key5);
        }
      });
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`style-state`;
  }
  if (process.env.NODE_ENV === "development" && debug === "verbose" && isClient) {
    if (isDevTools) {
      console.groupCollapsed("\u{1F539} getSplitStyles \u{1F447}");
      log({
        props,
        staticConfig,
        shouldDoClasses,
        styleProps,
        rulesToInsert,
        componentState,
        styleState,
        theme: {
          ...theme
        }
      });
    }
  }
  var {
    asChild
  } = props;
  var {
    accept
  } = staticConfig;
  var {
    noSkip,
    disableExpandShorthands,
    noExpand,
    styledContext
  } = styleProps;
  var {
    webContainerType
  } = conf.settings;
  var parentVariants = parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.variants;
  for (var keyOg in props) _loop(keyOg);
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-propsend`;
  }
  var avoidNormalize = styleProps.noNormalize === false;
  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style);
      if (!styleProps.noExpand && !styleProps.noMergeStyle) {
        if (isWeb && (isReactNative ? (driver === null || driver === void 0 ? void 0 : driver.inputStyle) !== "css" : true)) {
          styleToCSS(styleState.style);
        }
      }
    }
    if (styleState.flatTransforms) {
      var _styleState;
      (_styleState = styleState).style || (_styleState.style = {});
      mergeFlatTransforms(styleState.style, styleState.flatTransforms);
    }
    if (parentSplitStyles) {
      if (false) {
        if (shouldDoClasses) {
          for (var key in parentSplitStyles.classNames) {
            var val = parentSplitStyles.classNames[key];
            if (styleState.style && key in styleState.style || key in classNames) continue;
            classNames[key] = val;
          }
        }
      }
      if (!shouldDoClasses) {
        for (var key1 in parentSplitStyles.style) {
          var _styleState1;
          if (key1 in classNames || styleState.style && key1 in styleState.style) continue;
          (_styleState1 = styleState).style || (_styleState1.style = {});
          styleState.style[key1] = parentSplitStyles.style[key1];
        }
      }
    }
  }
  if (false) {
    var _styleState_style;
    var shouldStringifyTransforms = !styleProps.noNormalize && !staticConfig.isReactNative && !staticConfig.isHOC && (!styleProps.isAnimated || (driver === null || driver === void 0 ? void 0 : driver.inputStyle) === "css");
    if (shouldStringifyTransforms && Array.isArray((_styleState_style = styleState.style) === null || _styleState_style === void 0 ? void 0 : _styleState_style.transform)) {
      styleState.style.transform = transformsToString(styleState.style.transform);
    }
  }
  if (false) {
    if (!styleProps.noMergeStyle && styleState.style && shouldDoClasses) {
      var retainedStyles;
      var shouldRetain = false;
      if (styleState.style["$$css"]) {} else {
        var atomic = getCSSStylesAtomic(styleState.style);
        var _iteratorNormalCompletion = true,
          _didIteratorError = false,
          _iteratorError = void 0;
        try {
          for (var _iterator = atomic[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var atomicStyle = _step.value;
            var _props_animateOnly, _props_animateOnly1;
            var [key2, value, identifier] = atomicStyle;
            var isAnimatedAndTransitionOnly = styleProps.isAnimated && styleProps.noClass && ((_props_animateOnly = props.animateOnly) === null || _props_animateOnly === void 0 ? void 0 : _props_animateOnly.includes(key2));
            var nonAnimatedTransitionOnly = !isAnimatedAndTransitionOnly && !styleProps.isAnimated && isClient && (driver === null || driver === void 0 ? void 0 : driver.outputStyle) === "css" && ((_props_animateOnly1 = props.animateOnly) === null || _props_animateOnly1 === void 0 ? void 0 : _props_animateOnly1.includes(key2));
            if (isAnimatedAndTransitionOnly) {
              retainedStyles || (retainedStyles = {});
              retainedStyles[key2] = styleState.style[key2];
            } else if (nonAnimatedTransitionOnly) {
              retainedStyles || (retainedStyles = {});
              retainedStyles[key2] = value;
              shouldRetain = true;
            } else {
              addStyleToInsertRules(rulesToInsert, atomicStyle);
              classNames[key2] = identifier;
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
        if (process.env.NODE_ENV === "development" && props.debug === "verbose") {
          console.groupCollapsed(`\u{1F539} getSplitStyles final style object`);
          console.info(styleState.style);
          console.info(`retainedStyles`, retainedStyles);
          console.groupEnd();
        }
        if (shouldRetain || !(process.env.IS_STATIC === "is_static")) {
          styleState.style = retainedStyles || {};
        }
      }
    }
    if (!styleProps.noMergeStyle && styleState.style && !shouldDoClasses && styleProps.isAnimated && !(driver === null || driver === void 0 ? void 0 : driver.isReactNative)) {
      if (!styleState.style["$$css"]) {
        var toConvert = {};
        var hasProps = false;
        var animateOnly = props.animateOnly;
        for (var key3 in styleState.style) {
          if (key3 in nonAnimatableStyleProps) {
            toConvert[key3] = styleState.style[key3];
            delete styleState.style[key3];
            hasProps = true;
          }
        }
        if (hasProps) {
          var atomic1 = getCSSStylesAtomic(toConvert);
          var _iteratorNormalCompletion1 = true,
            _didIteratorError1 = false,
            _iteratorError1 = void 0;
          try {
            for (var _iterator1 = atomic1[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
              var atomicStyle1 = _step1.value;
              addStyleToInsertRules(rulesToInsert, atomicStyle1);
              classNames[atomicStyle1[StyleObjectProperty]] = atomicStyle1[StyleObjectIdentifier];
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
      }
    }
  }
  var styleProp = props.style;
  if (!styleProps.noMergeStyle && styleProp) {
    if (isHOC) {
      viewProps.style = normalizeStyle(styleProp);
    } else {
      var isArray = Array.isArray(styleProp);
      var len = isArray ? styleProp.length : 1;
      for (var i = 0; i < len; i++) {
        var style = isArray ? styleProp[i] : styleProp;
        if (style) {
          if (style["$$css"]) {
            Object.assign(styleState.classNames, style);
          } else {
            var _styleState2;
            (_styleState2 = styleState).style || (_styleState2.style = {});
            Object.assign(styleState.style, normalizeStyle(style));
          }
        }
      }
    }
  }
  if (true) {
    if (viewProps.tabIndex === 0) {
      var _viewProps;
      var _accessible;
      (_accessible = (_viewProps = viewProps).accessible) !== null && _accessible !== void 0 ? _accessible : _viewProps.accessible = true;
    }
    var style1 = styleState.style;
    if (style1 === null || style1 === void 0 ? void 0 : style1.fontFamily) {
      var _getFont;
      var faceInfo = (_getFont = getFont(style1.fontFamily)) === null || _getFont === void 0 ? void 0 : _getFont.face;
      if (faceInfo) {
        var _faceInfo_style_fontWeight_, _faceInfo_style_fontWeight;
        var overrideFace = (_faceInfo_style_fontWeight = faceInfo[style1.fontWeight]) === null || _faceInfo_style_fontWeight === void 0 ? void 0 : (_faceInfo_style_fontWeight_ = _faceInfo_style_fontWeight[style1.fontStyle || "normal"]) === null || _faceInfo_style_fontWeight_ === void 0 ? void 0 : _faceInfo_style_fontWeight_.val;
        if (overrideFace) {
          style1.fontFamily = overrideFace;
          styleState.fontFamily = overrideFace;
          delete style1.fontWeight;
          delete style1.fontStyle;
        }
      }
      if (process.env.NODE_ENV === "development" && debug && debug !== "profile") {
        log(`Found fontFamily native: ${style1.fontFamily}`, faceInfo);
      }
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-pre-result`;
  }
  var result = {
    hasMedia,
    fontFamily: styleState.fontFamily,
    viewProps,
    style: styleState.style,
    pseudos,
    classNames,
    rulesToInsert,
    dynamicThemeAccess,
    pseudoGroups,
    mediaGroups,
    overriddenContextProps: styleState.overriddenContextProps,
    pseudoTransitions: styleState.pseudoTransitions
  };
  var asChildExceptStyleLike = asChild === "except-style" || asChild === "except-style-web";
  if (!styleProps.noMergeStyle) {
    if (!asChildExceptStyleLike) {
      var style2 = styleState.style;
      if (false) {
        var fontFamily = isText || isInput ? styleState.fontFamily : null;
        if (fontFamily && fontFamily[0] === "$") {
          fontFamily = fontFamily.slice(1);
        }
        var fontFamilyClassName = fontFamily ? `font_${fontFamily}` : "";
        var groupClassName = props.group ? `t_group_${props.group}` : "";
        var componentNameFinal = props.componentName || staticConfig.componentName;
        var componentNameClassName = props.asChild || !componentNameFinal || componentNameFinal === "Text" ? "" : `is_${componentNameFinal}`;
        var classList = [];
        if (componentNameClassName) classList.push(componentNameClassName);
        if (!isText) classList.push("is_View");else classList.push("is_Text");
        if (fontFamilyClassName) classList.push(fontFamilyClassName);
        if (classNames) classList.push(Object.values(classNames).join(" "));
        if (groupClassName) classList.push(groupClassName);
        if (props.className) classList.push(props.className);
        var finalClassName = classList.join(" ");
        var needsCssStyles = isReactNative || styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.isReactNative);
        if (styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.inputStyle) === "css") {
          viewProps.className = finalClassName;
          if (style2) {
            viewProps.style = style2;
          }
        } else if (needsCssStyles) {
          var cnStyles;
          var _iteratorNormalCompletion2 = true,
            _didIteratorError2 = false,
            _iteratorError2 = void 0;
          try {
            for (var _iterator2 = finalClassName.split(" ")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var name = _step2.value;
              cnStyles || (cnStyles = {
                $$css: true
              });
              cnStyles[name] = name;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          viewProps.style = cnStyles ? [...(Array.isArray(style2) ? style2 : [style2]), cnStyles] : [style2];
        } else {
          if (finalClassName) {
            viewProps.className = finalClassName;
          }
          if (style2) {
            viewProps.style = style2;
          }
        }
      } else {
        if (style2) {
          viewProps.style = style2;
        }
      }
    }
  }
  if (process.env.NODE_ENV === "development" && debug === "verbose") {
    if (isClient && isDevTools) {
      console.groupEnd();
      console.groupCollapsed("\u{1F539} getSplitStyles ===>");
      try {
        var logs = {
          ...result,
          className,
          componentState,
          viewProps,
          rulesToInsert,
          parentSplitStyles
        };
        for (var key4 in logs) {
          log(key4, logs[key4]);
        }
      } catch (e) {}
      console.groupEnd();
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-done`;
  }
  return result;
};
function mergeFlatTransforms(target, flatTransforms) {
  Object.entries(flatTransforms).sort(function (param, param1) {
    var [a] = param,
      [b] = param1;
    return sortString(a, b);
  }).forEach(function (param) {
    var [key, val] = param;
    mergeTransform(target, key, val, true);
  });
}
function mergeStyle(styleState, key, val, importance) {
  var disableNormalize = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false,
    originalVal = arguments.length > 5 ? arguments[5] : void 0;
  var _staticConfig_context, _staticConfig_parentStaticConfig_context, _staticConfig_parentStaticConfig;
  var {
    viewProps,
    styleProps,
    staticConfig,
    usedKeys
  } = styleState;
  var existingImportance = usedKeys[key] || 0;
  if (existingImportance > importance) {
    return;
  }
  var contextProps = ((_staticConfig_context = staticConfig.context) === null || _staticConfig_context === void 0 ? void 0 : _staticConfig_context.props) || ((_staticConfig_parentStaticConfig = staticConfig.parentStaticConfig) === null || _staticConfig_parentStaticConfig === void 0 ? void 0 : (_staticConfig_parentStaticConfig_context = _staticConfig_parentStaticConfig.context) === null || _staticConfig_parentStaticConfig_context === void 0 ? void 0 : _staticConfig_parentStaticConfig_context.props);
  if (contextProps && key in contextProps) {
    var _styleState_originalContextPropValues;
    var _styleState;
    (_styleState = styleState).overriddenContextProps || (_styleState.overriddenContextProps = {});
    var originalFromState = (_styleState_originalContextPropValues = styleState.originalContextPropValues) === null || _styleState_originalContextPropValues === void 0 ? void 0 : _styleState_originalContextPropValues[key];
    var _ref;
    styleState.overriddenContextProps[key] = (_ref = originalVal !== null && originalVal !== void 0 ? originalVal : originalFromState) !== null && _ref !== void 0 ? _ref : val;
  }
  if (key in stylePropsTransform) {
    var _styleState1;
    (_styleState1 = styleState).flatTransforms || (_styleState1.flatTransforms = {});
    usedKeys[key] = importance;
    styleState.flatTransforms[key] = val;
  } else {
    var shouldNormalize = isWeb && !disableNormalize && !styleProps.noNormalize;
    var out = shouldNormalize ? normalizeValueWithProperty(val, key) : val;
    if (
    // accept is for props not styles
    staticConfig.accept && key in staticConfig.accept) {
      viewProps[key] = out;
    } else {
      var _styleState2;
      (_styleState2 = styleState).style || (_styleState2.style = {});
      usedKeys[key] = importance;
      styleState.style[key] =
      // if you dont do this you'll be passing props.transform arrays directly here and then mutating them
      // if theres any flatTransforms later, causing issues (mutating props is bad, in strict mode styles get borked)
      key === "transform" && Array.isArray(out) ? [...out] : out;
    }
  }
}
var getSubStyle = function (styleState, subKey, styleIn, avoidMergeTransform) {
  var _loop = function (key1) {
    var val = styleIn[key1];
    key1 = conf2.shorthands[key1] || key1;
    if (key1 === "transition") {
      var _driver_animations;
      var _styleState;
      (_styleState = styleState).pseudoTransitions || (_styleState.pseudoTransitions = {});
      styleState.pseudoTransitions[subKey] = val;
      var driver = styleState.animationDriver;
      if ((driver === null || driver === void 0 ? void 0 : driver.outputStyle) === "css") {
        var _driver_animations1;
        var animationConfig = (_driver_animations1 = driver.animations) === null || _driver_animations1 === void 0 ? void 0 : _driver_animations1[val];
        if (animationConfig) {
          var important = subKey[0] === "$" ? " !important" : "";
          styleOut["transition"] = `all ${animationConfig}${important}`;
        }
      }
      if (!styleOut["transition"] && typeof val === "string" && !(driver === null || driver === void 0 ? void 0 : (_driver_animations = driver.animations) === null || _driver_animations === void 0 ? void 0 : _driver_animations[val])) {
        styleOut["transition"] = val;
      }
      return key = key1, "continue";
    }
    var shouldSkip = !staticConfig.isHOC && key1 in skipProps && !styleProps.noSkip;
    if (shouldSkip) {
      return key = key1, "continue";
    }
    propMapper(key1, val, styleState, false, function (skey, sval, originalVal) {
      if (originalVal !== void 0) {
        originalValues || (originalValues = {});
        originalValues[skey] = originalVal;
      }
      if (skey in validPseudoKeys) {
        sval = getSubStyle(styleState, skey, sval, avoidMergeTransform);
      }
      if (!avoidMergeTransform && skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval);
      } else {
        styleOut[skey] = styleProps.noNormalize ? sval : normalizeValueWithProperty(sval, key1);
      }
    });
    key = key1, void 0;
  };
  var {
    staticConfig,
    conf: conf2,
    styleProps
  } = styleState;
  var styleOut = {};
  var originalValues;
  for (var key in styleIn) _loop(key);
  if (!avoidMergeTransform) {
    var _styleState_style;
    var parentTransform = (_styleState_style = styleState.style) === null || _styleState_style === void 0 ? void 0 : _styleState_style.transform;
    var flatTransforms = styleState.flatTransforms;
    var styleOutTransform = styleOut.transform;
    if (Array.isArray(styleOutTransform) && styleOutTransform.length) {
      var len = styleOutTransform.length;
      if (Array.isArray(parentTransform)) {
        var merged = [];
        outer: for (var i = 0; i < parentTransform.length; i++) {
          var pt = parentTransform[i];
          for (var pk in pt) {
            for (var j = 0; j < len; j++) {
              for (var sk in styleOutTransform[j]) {
                if (pk === sk) continue outer;
                break;
              }
            }
            merged.push(pt);
            break;
          }
        }
        for (var i1 = 0; i1 < len; i1++) merged.push(styleOutTransform[i1]);
        styleOut.transform = merged;
      }
      if (flatTransforms) {
        outer: for (var fk in flatTransforms) {
          var ck = fk === "x" ? "translateX" : fk === "y" ? "translateY" : fk;
          for (var j1 = 0; j1 < len; j1++) {
            for (var sk1 in styleOutTransform[j1]) {
              if (ck === sk1) continue outer;
              break;
            }
          }
          mergeTransform(styleOut, fk, flatTransforms[fk]);
        }
      }
    } else if (flatTransforms) {
      mergeFlatTransforms(styleOut, flatTransforms);
    }
  }
  if (!styleProps.noNormalize) {
    fixStyles(styleOut);
  }
  if (originalValues) {
    styleOriginalValues.set(styleOut, originalValues);
  }
  return styleOut;
};
var useInsertEffectCompat = isWeb ? React.useInsertionEffect || useIsomorphicLayoutEffect : function () {};
var useSplitStyles = function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
  "use no memo";

  var res = getSplitStyles(a, b, c, d, e, f, g, h, i, j, k, l, m);
  if (false) {
    useInsertEffectCompat(function () {
      if (res) {
        insertStyleRules(res.rulesToInsert);
      }
    }, [res === null || res === void 0 ? void 0 : res.rulesToInsert]);
  }
  return res;
};
function addStyleToInsertRules(rulesToInsert, styleObject) {
  if (false) {
    var identifier = styleObject[StyleObjectIdentifier];
    if (shouldInsertStyleRules(identifier)) {
      updateRules(identifier, styleObject[StyleObjectRules]);
      rulesToInsert[identifier] = styleObject;
    }
  }
}
var defaultColor = process.env.GUI_DEFAULT_COLOR || "rgba(0,0,0,0)";
var animatableDefaults = {
  ...Object.fromEntries(Object.entries(tokenCategories.color).map(function (param) {
    var [k, v] = param;
    return [k, defaultColor];
  })),
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  skewX: "0deg",
  skewY: "0deg",
  x: 0,
  y: 0,
  borderRadius: 0
};
var mergeTransform = function (obj, key, val) {
  var backwards = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  var _obj;
  if (typeof obj.transform === "string") {
    return;
  }
  (_obj = obj).transform || (_obj.transform = []);
  obj.transform[backwards ? "unshift" : "push"]({
    [mapTransformKeys[key] || key]: val
  });
};
var mapTransformKeys = {
  x: "translateX",
  y: "translateY"
};
function passDownProp(viewProps, key, val) {
  var shouldMergeObject = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  if (shouldMergeObject) {
    var next = {
      ...viewProps[key],
      ...val
    };
    delete viewProps[key];
    viewProps[key] = next;
  } else {
    viewProps[key] = val;
  }
}
function mergeMediaByImportance(styleState, mediaKey, key, value, isSizeMedia, importanceBump, debugProp, originalVal) {
  var usedKeys = styleState.usedKeys;
  var importance = getMediaImportanceIfMoreImportant(mediaKey, key, styleState, isSizeMedia);
  if (importanceBump) {
    var bumpedImportance = defaultMediaImportance + importanceBump;
    importance = !usedKeys[key] || bumpedImportance > usedKeys[key] ? bumpedImportance : null;
  }
  if (process.env.NODE_ENV === "development" && debugProp === "verbose") {
    log(`mergeMediaByImportance ${key} importance usedKey ${usedKeys[key]} next ${importance}`);
  }
  if (importance === null) {
    return false;
  }
  if (key in pseudoDescriptors) {
    var descriptor = pseudoDescriptors[key];
    var descriptorKey = descriptor.stateKey || descriptor.name;
    var isDisabled = styleState.componentState[descriptorKey] === false;
    if (isDisabled) {
      return false;
    }
    var pseudoOriginalValues = styleOriginalValues.get(value);
    for (var subKey in value) {
      mergeStyle(styleState, subKey, value[subKey], importance, false, pseudoOriginalValues === null || pseudoOriginalValues === void 0 ? void 0 : pseudoOriginalValues[subKey]);
    }
  } else {
    mergeStyle(styleState, key, value, importance, false, originalVal);
  }
  return true;
}
function normalizeStyle(style) {
  var out = {};
  for (var key in style) {
    var val = style[key];
    if (key in stylePropsTransform) {
      mergeTransform(out, key, val);
    } else {
      out[key] = normalizeValueWithProperty(val, key);
    }
  }
  if (isWeb && Array.isArray(out.transform)) {
    out.transform = transformsToString(out.transform);
  }
  fixStyles(out);
  return out;
}
function applyDefaultStyle(pkey, styleState) {
  var defaultValues = animatableDefaults[pkey];
  if (defaultValues != null && !(pkey in styleState.usedKeys) && (!styleState.style || !(pkey in styleState.style))) {
    mergeStyle(styleState, pkey, defaultValues, 1);
  }
}
export { PROP_SPLIT, getSplitStyles, getSubStyle, styleOriginalValues, useSplitStyles };
//# sourceMappingURL=getSplitStyles.native.js.map
