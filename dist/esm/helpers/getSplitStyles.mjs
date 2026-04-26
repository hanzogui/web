import { isClient, isWeb, useIsomorphicLayoutEffect } from "@hanzogui/constants";
import { StyleObjectIdentifier, StyleObjectProperty, StyleObjectPseudo, StyleObjectRules, nonAnimatableStyleProps, stylePropsText, stylePropsTransform, tokenCategories, validPseudoKeys, validStyles as validStylesView } from "@hanzogui/helpers";
import React from "react";
import { getConfig } from "../config.mjs";
import { isDevTools } from "../constants/isDevTools.mjs";
import { getMediaImportanceIfMoreImportant, getMediaKey, getMediaKeyImportance, mediaKeyMatch } from "../hooks/useMedia.mjs";
import { mediaState as globalMediaState, mediaQueryConfig } from "./mediaState.mjs";
import { createMediaStyle } from "./createMediaStyle.mjs";
import { fixStyles } from "./expandStyles.mjs";
import { getCSSStylesAtomic, getStyleAtomic, styleToCSS } from "./getCSSStylesAtomic.mjs";
import { getDefaultProps } from "./getDefaultProps.mjs";
import { getGroupPropParts } from "./getGroupPropParts.mjs";
import { insertStyleRules, shouldInsertStyleRules, updateRules } from "./insertStyleRule.mjs";
import { isActivePlatform, getPlatformSpecificityBump } from "./isActivePlatform.mjs";
import { isActiveTheme } from "./isActiveTheme.mjs";
import { log } from "./log.mjs";
import { normalizeValueWithProperty } from "./normalizeValueWithProperty.mjs";
import { propMapper } from "./propMapper.mjs";
import { pseudoDescriptors, pseudoPriorities, defaultMediaImportance } from "./pseudoDescriptors.mjs";
import { skipProps } from "./skipProps.mjs";
import { sortString } from "./sortString.mjs";
import { transformsToString } from "./transformsToString.mjs";
let conf;
const styleOriginalValues = /* @__PURE__ */new WeakMap();
const PROP_SPLIT = "-";
function normalizeGroupKey(key, groupContext) {
  const parts = key.split("-");
  const plen = parts.length;
  if (
  // check if its actually a simple group selector to avoid breaking selectors
  plen === 2 || plen === 3 && pseudoPriorities[parts[parts.length - 1]]) {
    const name = parts[1];
    if (name !== "true" && groupContext && !groupContext[name]) {
      return key.replace("$group-", "$group-true-");
    }
  }
  return key;
}
function isValidStyleKey(key, validStyles, accept) {
  return key in validStyles ? true : accept && key in accept;
}
const getSplitStyles = (props, staticConfig, theme, themeName, componentState, styleProps, parentSplitStyles, componentContext, groupContext, elementType, startedUnhydrated, debug, animationDriver) => {
  conf = conf || getConfig();
  const driver = animationDriver || componentContext?.animationDriver || conf.animations;
  if (props.passThrough) {
    return null;
  }
  if (isWeb && styleProps.isAnimated && driver?.isReactNative && !styleProps.noNormalize) {
    styleProps.noNormalize = "values";
  }
  const {
    shorthands
  } = conf;
  const {
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
  const viewProps = {};
  const mediaState = styleProps.mediaState || globalMediaState;
  const shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass;
  const rulesToInsert = false ? void 0 : {};
  const classNames = {};
  let space = props.space;
  let pseudos = null;
  let hasMedia = false;
  let dynamicThemeAccess;
  let pseudoGroups;
  let mediaGroups;
  let className = props.className || "";
  let mediaStylesSeen = 0;
  const validStyles = staticConfig.validStyles || (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView);
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-setup`;
  }
  const styleState = {
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
    const {
      fallbackProps
    } = styleProps;
    if (fallbackProps) {
      styleState.props = new Proxy(props, {
        get(_, key, val) {
          if (!Reflect.has(props, key)) {
            return Reflect.get(fallbackProps, key);
          }
          return Reflect.get(props, key);
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
  const {
    asChild
  } = props;
  const {
    accept
  } = staticConfig;
  const {
    noSkip,
    disableExpandShorthands,
    noExpand,
    styledContext
  } = styleProps;
  const {
    webContainerType
  } = conf.settings;
  const parentVariants = parentStaticConfig?.variants;
  for (const keyOg in props) {
    let keyInit = keyOg;
    let valInit = props[keyInit];
    if (keyInit === "children") {
      viewProps[keyInit] = valInit;
      continue;
    }
    if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
      time`before-prop-${keyInit}`;
    }
    if (process.env.NODE_ENV === "test" && keyInit === "jestAnimatedStyle") {
      continue;
    }
    if (accept) {
      const accepted = accept[keyInit];
      if ((accepted === "style" || accepted === "textStyle") && valInit && typeof valInit === "object") {
        viewProps[keyInit] = getSubStyle(styleState, keyInit, valInit, styleProps.noClass);
        continue;
      }
    }
    if (!disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit];
      }
    }
    if (keyInit === "className") continue;
    if (asChild) {
      const defaults = getDefaultProps(staticConfig);
      if (defaults) {
        const defaultVal = defaults[keyOg] ?? defaults[keyInit];
        if (defaultVal !== void 0 && valInit === defaultVal) {
          continue;
        }
      }
    }
    if (keyInit in skipProps && !noSkip && !isHOC) {
      if (keyInit === "group") {
        if (true) {
          const identifier = `t_group_${valInit}`;
          const containerType = webContainerType || "inline-size";
          const containerCSS = ["container", void 0, identifier, void 0, [`.${identifier} { container-name: ${valInit}; container-type: ${containerType}; }`]];
          addStyleToInsertRules(rulesToInsert, containerCSS);
        }
      }
      if (keyInit === "transition" && typeof valInit === "string" && !driver?.animations?.[valInit]) {} else {
        continue;
      }
    }
    let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept);
    if (true) {
      if (staticConfig.isReactNative && keyInit.startsWith("data-")) {
        keyInit = keyInit.replace("data-", "");
        viewProps["dataSet"] ||= {};
        viewProps["dataSet"][keyInit] = valInit;
        continue;
      }
    }
    if (false) {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          if (keyInit === "elevationAndroid") continue;
        }
        if (keyInit === "userSelect") {
          keyInit = "selectable";
          valInit = valInit !== "none";
        } else if (keyInit.startsWith("data-")) {
          continue;
        }
      }
    }
    if (true) {
      if (!noExpand) {
        if (keyInit === "disabled" && valInit === true) {
          viewProps["aria-disabled"] = true;
          if (elementType === "button" || elementType === "form" || elementType === "input" || elementType === "select" || elementType === "textarea") {
            viewProps.disabled = true;
          }
          if (!variants?.disabled) {
            continue;
          }
        }
        if (keyInit === "testID") {
          if (isReactNative) {
            viewProps.testID = valInit;
          } else {
            viewProps["data-testid"] = valInit;
            if (styleProps.isAnimated && driver?.isReactNative) {
              viewProps.testID = valInit;
            }
          }
          continue;
        }
        if (keyInit === "id") {
          viewProps.id = valInit;
          continue;
        }
      }
    }
    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants;
    const isStyleLikeKey = isValidStyleKeyInit || isVariant;
    let isPseudo = keyInit in validPseudoKeys;
    let isMedia = !isStyleLikeKey && !isPseudo ? getMediaKey(keyInit) : false;
    let isMediaOrPseudo = Boolean(isMedia || isPseudo);
    if (isMediaOrPseudo && isMedia === "group") {
      keyInit = normalizeGroupKey(keyInit, groupContext);
    }
    const isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || isVariant && !noExpand;
    if (isStyleProp && (asChild === "except-style" || asChild === "except-style-web")) {
      continue;
    }
    const shouldPassProp = !isStyleProp && isHOC ||
    // is in parent variants
    isHOC && parentVariants && keyInit in parentVariants || inlineProps?.has(keyInit);
    const parentVariant = parentVariants?.[keyInit];
    const isHOCShouldPassThrough = Boolean(isHOC && (isValidStyleKeyInit || isMediaOrPseudo || parentVariant || keyInit in skipProps));
    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough;
    if (process.env.NODE_ENV === "development" && debug === "verbose") {
      console.groupCollapsed(`  \u{1F511} ${keyOg}${keyInit !== keyOg ? ` (shorthand for ${keyInit})` : ""} ${shouldPassThrough ? "(pass)" : ""}`);
      log({
        isVariant,
        valInit,
        shouldPassProp
      });
      if (isClient) {
        log({
          variants,
          variant: variants?.[keyInit],
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
        continue;
      }
    }
    if (!noSkip) {
      if (keyInit in skipProps && !(keyInit === "transition" && typeof valInit === "string" && !driver?.animations?.[valInit])) {
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          console.groupEnd();
        }
        continue;
      }
    }
    if (isText || isInput) {
      if (valInit && (keyInit === "fontFamily" || keyInit === shorthands["fontFamily"]) && valInit in conf.fontsParsed) {
        styleState.fontFamily = valInit;
      }
    }
    const disablePropMap = isMediaOrPseudo || !isStyleLikeKey;
    propMapper(keyInit, valInit, styleState, disablePropMap, (key, val, originalVal) => {
      const isStyledContextProp = styledContext && key in styledContext;
      if (!isHOC && disablePropMap && !isStyledContextProp && !isMediaOrPseudo) {
        viewProps[key] = val;
        return;
      }
      if (process.env.NODE_ENV === "development" && debug === "verbose") {
        console.groupCollapsed("  \u{1F4A0} expanded", keyInit, "=>", key);
        log(val);
        console.groupEnd();
      }
      if (val == null) return;
      if (false) {
        if (key === "pointerEvents") {
          viewProps[key] = val;
          return;
        }
      }
      if (!isHOC && isValidStyleKey(key, validStyles, accept) || false) {
        mergeStyle(styleState, key, val, 1, false, originalVal);
        return;
      }
      isPseudo = key in validPseudoKeys;
      isMedia = isPseudo ? false : getMediaKey(key);
      isMediaOrPseudo = Boolean(isMedia || isPseudo);
      isVariant = variants && key in variants;
      if (isMedia === "group") {
        key = normalizeGroupKey(key, groupContext);
      }
      if (inlineProps?.has(key) || process.env.IS_STATIC === "is_static" && inlineWhenUnflattened?.has(key)) {
        viewProps[key] = props[key] ?? val;
      }
      const shouldPassThrough2 = styleProps.noExpand && isPseudo || isHOC && (isMediaOrPseudo || parentStaticConfig?.variants?.[keyInit]);
      if (shouldPassThrough2) {
        passDownProp(viewProps, key, val, isMediaOrPseudo);
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          console.groupCollapsed(` - passing down prop ${key}`);
          log({
            val,
            after: {
              ...viewProps[key]
            }
          });
          console.groupEnd();
        }
        return;
      }
      if (isPseudo) {
        if (!val) return;
        const pseudoStyleObject = getSubStyle(styleState, key, val, styleProps.noClass && !(process.env.IS_STATIC === "is_static"));
        if (!shouldDoClasses || process.env.IS_STATIC === "is_static") {
          pseudos ||= {};
          pseudos[key] ||= {};
          if (process.env.IS_STATIC === "is_static") {
            Object.assign(pseudos[key], pseudoStyleObject);
            return;
          }
        }
        const descriptor = pseudoDescriptors[key];
        const isEnter = key === "enterStyle";
        const isExit = key === "exitStyle";
        if (!descriptor) {
          return;
        }
        if (shouldDoClasses && !isExit) {
          const pseudoStyles = getStyleAtomic(pseudoStyleObject, descriptor);
          if (process.env.NODE_ENV === "development" && debug === "verbose") {
            console.info("pseudo:", key, pseudoStyleObject, pseudoStyles);
          }
          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle[StyleObjectProperty]}${PROP_SPLIT}${descriptor.name}`;
            addStyleToInsertRules(rulesToInsert, psuedoStyle);
            classNames[fullKey] = psuedoStyle[StyleObjectIdentifier];
          }
        }
        if (!shouldDoClasses || isExit || isEnter) {
          const descriptorKey = descriptor.stateKey || descriptor.name;
          let isDisabled = componentState[descriptorKey] === false;
          if (isExit) {
            isDisabled = !styleProps.isExiting;
          }
          if (isEnter && componentState.unmounted === false) {
            isDisabled = true;
          }
          if (process.env.NODE_ENV === "development" && debug === "verbose") {
            console.groupCollapsed("pseudo", key, {
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
          const importance = descriptor.priority;
          const pseudoOriginalValues = styleOriginalValues.get(pseudoStyleObject);
          for (const pkey in pseudoStyleObject) {
            const val2 = pseudoStyleObject[pkey];
            if (isDisabled) {
              applyDefaultStyle(pkey, styleState);
            } else {
              const curImportance = styleState.usedKeys[pkey] || 0;
              const shouldMerge = importance >= curImportance;
              if (shouldMerge) {
                if (process.env.IS_STATIC === "is_static") {
                  pseudos ||= {};
                  pseudos[key] ||= {};
                  pseudos[key][pkey] = val2;
                }
                mergeStyle(styleState, pkey, val2, importance, false, pseudoOriginalValues?.[pkey]);
              }
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log("    subKey", pkey, shouldMerge, {
                  importance,
                  curImportance,
                  pkey,
                  val: val2
                });
              }
            }
          }
          if (!isDisabled) {
            for (const key2 in val) {
              const k = shorthands[key2] || key2;
              styleState.usedKeys[k] = Math.max(importance, styleState.usedKeys[k] || 0);
            }
          }
        }
        return;
      }
      if (isMedia) {
        if (!val) return;
        const mediaKeyShort = key.slice(isMedia == "theme" ? 7 : 1);
        hasMedia ||= true;
        const hasSpace = val["space"];
        if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
          if (!hasMedia || typeof hasMedia === "boolean") {
            hasMedia = /* @__PURE__ */new Set();
          }
          hasMedia.add(mediaKeyShort);
        }
        if (isMedia === "platform") {
          if (!isActivePlatform(key)) {
            return;
          }
        }
        if (process.env.NODE_ENV === "development" && debug === "verbose") {
          log(`  \u{1F4FA} ${key}`, {
            key,
            val,
            props,
            shouldDoClasses,
            acceptsClassName,
            componentState,
            mediaState
          });
        }
        const priority = mediaStylesSeen;
        mediaStylesSeen += 1;
        if (shouldDoClasses) {
          const mediaStyle = getSubStyle(styleState, key, val, false);
          const mediaStyles = getCSSStylesAtomic(mediaStyle);
          for (const style of mediaStyles) {
            const property = style[StyleObjectProperty];
            const isSubStyle = property[0] === "$";
            if (isSubStyle && !isActivePlatform(property)) {
              continue;
            }
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig, isMedia, false, priority);
            if (process.env.NODE_ENV === "development" && debug === "verbose") {
              log(`\u{1F4FA} media style:`, out);
            }
            const subKey = isSubStyle ? style[2] : "";
            const fullKey = `${style[StyleObjectProperty]}${subKey}${PROP_SPLIT}${mediaKeyShort}${style[StyleObjectPseudo] || ""}`;
            addStyleToInsertRules(rulesToInsert, out);
            classNames[fullKey] = out[StyleObjectIdentifier];
          }
        } else {
          let mergeMediaStyle = function (key2, val2, originalVal2) {
            if (process.env.TAMAGUI_TARGET === "native") {
              if (!isValidStyleKey(key2, validStyles, accept)) {
                viewProps[key2] = val2;
                return;
              }
            }
            styleState.style ||= {};
            const didMerge = mergeMediaByImportance(styleState, mediaKeyShort, key2, val2, mediaState[mediaKeyShort], importanceBump, debug, originalVal2);
            if (didMerge && key2 === "fontFamily") {
              styleState.fontFamily = mediaStyle.fontFamily;
            }
          };
          const isThemeMedia = isMedia === "theme";
          const isGroupMedia = isMedia === "group";
          const isPlatformMedia = isMedia === "platform";
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
          const mediaStyle = getSubStyle(styleState, key, val, true);
          let importanceBump = 0;
          if (isThemeMedia) {
            if (false) {
              styleState.style ||= {};
              const scheme = mediaKeyShort;
              const oppositeScheme = getOppositeScheme(mediaKeyShort);
              const themeOriginalValues = styleOriginalValues.get(mediaStyle);
              const isCurrentScheme = themeName === scheme || themeName.startsWith(scheme);
              for (const subKey in mediaStyle) {
                const val2 = extractValueFromDynamic(mediaStyle[subKey], scheme);
                const existing = styleState.style[subKey];
                if (!isColorStyleKey(subKey)) {
                  dynamicThemeAccess = true;
                  if (isCurrentScheme) {
                    mediaStyle[subKey] = val2;
                  } else {
                    delete mediaStyle[subKey];
                  }
                  continue;
                }
                if (existing?.dynamic) {
                  existing.dynamic[scheme] = val2;
                  mediaStyle[subKey] = existing;
                } else {
                  const oppositeVal = extractValueFromDynamic(existing, oppositeScheme);
                  mediaStyle[subKey] = getDynamicVal({
                    scheme,
                    val: val2,
                    oppositeVal
                  });
                  mergeStyle(styleState, subKey, mediaStyle[subKey], priority, false, themeOriginalValues?.[subKey]);
                }
              }
            } else {
              dynamicThemeAccess = true;
              if (!(themeName === mediaKeyShort || themeName.startsWith(mediaKeyShort))) {
                return;
              }
            }
          } else if (isGroupMedia) {
            const groupInfo = getGroupPropParts(mediaKeyShort);
            const groupName = groupInfo.name;
            const groupState = groupContext?.[groupName]?.state;
            const groupPseudoKey = groupInfo.pseudo;
            const groupMediaKey = groupInfo.media;
            if (!groupState) {
              if (process.env.NODE_ENV === "development" && debug) {
                log(`No parent with group prop, skipping styles: ${groupName}`);
              }
              pseudoGroups ||= /* @__PURE__ */new Set();
              return;
            }
            const componentGroupState = componentState.group?.[groupName];
            if (groupMediaKey) {
              mediaGroups ||= /* @__PURE__ */new Set();
              mediaGroups.add(groupMediaKey);
              const mediaState2 = componentGroupState?.media;
              let isActive = mediaState2?.[groupMediaKey];
              if (!mediaState2 && groupState.layout) {
                isActive = mediaKeyMatch(groupMediaKey, groupState.layout);
              }
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(` \u{1F3D8}\uFE0F GROUP media ${groupMediaKey} active? ${isActive}`, {
                  ...mediaState2,
                  usedKeys: {
                    ...styleState.usedKeys
                  }
                });
              }
              if (!isActive) {
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState);
                }
                return;
              }
              importanceBump = 2;
            }
            if (groupPseudoKey) {
              pseudoGroups ||= /* @__PURE__ */new Set();
              pseudoGroups.add(groupName);
              const componentGroupPseudoState = (componentGroupState ||
              // fallback to context initially
              groupContext?.[groupName].state)?.pseudo;
              const isActive = componentGroupPseudoState?.[groupPseudoKey];
              const priority2 = pseudoPriorities[groupPseudoKey];
              if (process.env.NODE_ENV === "development" && debug === "verbose") {
                log(` \u{1F3D8}\uFE0F GROUP pseudo ${groupMediaKey} active? ${isActive}, priority ${priority2}`, {
                  componentGroupPseudoState: {
                    ...componentGroupPseudoState
                  },
                  usedKeys: {
                    ...styleState.usedKeys
                  }
                });
              }
              if (!isActive) {
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState);
                }
                return;
              }
              importanceBump = priority2;
            }
          } else if (isPlatformMedia) {
            importanceBump = getPlatformSpecificityBump(mediaKeyShort);
          }
          const mediaOriginalValues = styleOriginalValues.get(mediaStyle);
          if (isGroupMedia && mediaStyle.transition) {
            styleState.pseudoTransitions ||= {};
            styleState.pseudoTransitions[`$${mediaKeyShort}`] = mediaStyle.transition;
          }
          for (const subKey in mediaStyle) {
            if (subKey === "space") {
              continue;
            }
            if (subKey[0] === "$") {
              const subMediaType = getMediaKey(subKey);
              if (subMediaType === "platform") {
                if (!isActivePlatform(subKey)) continue;
              } else if (subMediaType === "theme") {
                if (!isActiveTheme(subKey, themeName)) continue;
              } else if (subMediaType === true) {
                const subKeyShort = subKey.slice(1);
                if (!mediaState[subKeyShort]) continue;
              }
              const nestedVal = mediaStyle[subKey];
              const subOriginalValues = styleOriginalValues.get(nestedVal);
              const isSizeMediaKey = !!mediaState[mediaKeyShort];
              const outerBase = isSizeMediaKey ? getMediaKeyImportance(mediaKeyShort) : defaultMediaImportance;
              let innerBase;
              if (subMediaType === "platform") {
                innerBase = defaultMediaImportance + getPlatformSpecificityBump(subKey.slice(1));
              } else if (subMediaType === true) {
                innerBase = getMediaKeyImportance(subKey.slice(1));
              } else {
                innerBase = defaultMediaImportance;
              }
              const nestedImportance = outerBase + importanceBump + innerBase + 1;
              for (const subSubKey in nestedVal) {
                const expandedKey = shorthands[subSubKey] || subSubKey;
                const {
                  usedKeys
                } = styleState;
                if (usedKeys[expandedKey] && usedKeys[expandedKey] > nestedImportance) {
                  continue;
                }
                styleState.style ||= {};
                mergeStyle(styleState, expandedKey, nestedVal[subSubKey], nestedImportance, false, subOriginalValues?.[subSubKey]);
                if (expandedKey === "fontFamily") {
                  styleState.fontFamily = nestedVal[subSubKey];
                }
              }
            } else {
              mergeMediaStyle(subKey, mediaStyle[subKey], mediaOriginalValues?.[subKey]);
            }
          }
        }
        return;
      }
      if (!isVariant) {
        if (isStyledContextProp) {
          return;
        }
        viewProps[key] = val;
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
      } catch {}
      console.groupEnd();
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-propsend`;
  }
  const avoidNormalize = styleProps.noNormalize === false;
  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style);
      if (!styleProps.noExpand && !styleProps.noMergeStyle) {
        if (isWeb && (isReactNative ? driver?.inputStyle !== "css" : true)) {
          styleToCSS(styleState.style);
        }
      }
    }
    if (styleState.flatTransforms) {
      styleState.style ||= {};
      mergeFlatTransforms(styleState.style, styleState.flatTransforms);
    }
    if (parentSplitStyles) {
      if (true) {
        if (shouldDoClasses) {
          for (const key in parentSplitStyles.classNames) {
            const val = parentSplitStyles.classNames[key];
            if (styleState.style && key in styleState.style || key in classNames) continue;
            classNames[key] = val;
          }
        }
      }
      if (!shouldDoClasses) {
        for (const key in parentSplitStyles.style) {
          if (key in classNames || styleState.style && key in styleState.style) continue;
          styleState.style ||= {};
          styleState.style[key] = parentSplitStyles.style[key];
        }
      }
    }
  }
  if (true) {
    const shouldStringifyTransforms = !styleProps.noNormalize && !staticConfig.isReactNative && !staticConfig.isHOC && (!styleProps.isAnimated || driver?.inputStyle === "css");
    if (shouldStringifyTransforms && Array.isArray(styleState.style?.transform)) {
      styleState.style.transform = transformsToString(styleState.style.transform);
    }
  }
  if (true) {
    if (!styleProps.noMergeStyle && styleState.style && shouldDoClasses) {
      let retainedStyles;
      let shouldRetain = false;
      if (styleState.style["$$css"]) {} else {
        const atomic = getCSSStylesAtomic(styleState.style);
        for (const atomicStyle of atomic) {
          const [key, value, identifier] = atomicStyle;
          const isAnimatedAndTransitionOnly = styleProps.isAnimated && styleProps.noClass && props.animateOnly?.includes(key);
          const nonAnimatedTransitionOnly = !isAnimatedAndTransitionOnly && !styleProps.isAnimated && isClient && driver?.outputStyle === "css" && props.animateOnly?.includes(key);
          if (isAnimatedAndTransitionOnly) {
            retainedStyles ||= {};
            retainedStyles[key] = styleState.style[key];
          } else if (nonAnimatedTransitionOnly) {
            retainedStyles ||= {};
            retainedStyles[key] = value;
            shouldRetain = true;
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle);
            classNames[key] = identifier;
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
    if (!styleProps.noMergeStyle && styleState.style && !shouldDoClasses && styleProps.isAnimated && !driver?.isReactNative) {
      if (!styleState.style["$$css"]) {
        const toConvert = {};
        let hasProps = false;
        const animateOnly = props.animateOnly;
        for (const key in styleState.style) {
          if (key in nonAnimatableStyleProps) {
            toConvert[key] = styleState.style[key];
            delete styleState.style[key];
            hasProps = true;
          }
        }
        if (hasProps) {
          const atomic = getCSSStylesAtomic(toConvert);
          for (const atomicStyle of atomic) {
            addStyleToInsertRules(rulesToInsert, atomicStyle);
            classNames[atomicStyle[StyleObjectProperty]] = atomicStyle[StyleObjectIdentifier];
          }
        }
      }
    }
  }
  const styleProp = props.style;
  if (!styleProps.noMergeStyle && styleProp) {
    if (isHOC) {
      viewProps.style = normalizeStyle(styleProp);
    } else {
      const isArray = Array.isArray(styleProp);
      const len = isArray ? styleProp.length : 1;
      for (let i = 0; i < len; i++) {
        const style = isArray ? styleProp[i] : styleProp;
        if (style) {
          if (style["$$css"]) {
            Object.assign(styleState.classNames, style);
          } else {
            styleState.style ||= {};
            Object.assign(styleState.style, normalizeStyle(style));
          }
        }
      }
    }
  }
  if (false) {
    if (viewProps.tabIndex === 0) {
      viewProps.accessible ??= true;
    }
    const style = styleState.style;
    if (style?.fontFamily) {
      const faceInfo = getFont(style.fontFamily)?.face;
      if (faceInfo) {
        const overrideFace = faceInfo[style.fontWeight]?.[style.fontStyle || "normal"]?.val;
        if (overrideFace) {
          style.fontFamily = overrideFace;
          styleState.fontFamily = overrideFace;
          delete style.fontWeight;
          delete style.fontStyle;
        }
      }
      if (process.env.NODE_ENV === "development" && debug && debug !== "profile") {
        log(`Found fontFamily native: ${style.fontFamily}`, faceInfo);
      }
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-pre-result`;
  }
  const result = {
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
  const asChildExceptStyleLike = asChild === "except-style" || asChild === "except-style-web";
  if (!styleProps.noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style;
      if (true) {
        let fontFamily = isText || isInput ? styleState.fontFamily : null;
        if (fontFamily && fontFamily[0] === "$") {
          fontFamily = fontFamily.slice(1);
        }
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : "";
        const groupClassName = props.group ? `t_group_${props.group}` : "";
        const componentNameFinal = props.componentName || staticConfig.componentName;
        const componentNameClassName = props.asChild || !componentNameFinal || componentNameFinal === "Text" ? "" : `is_${componentNameFinal}`;
        let classList = [];
        if (componentNameClassName) classList.push(componentNameClassName);
        if (!isText) classList.push("is_View");else classList.push("is_Text");
        if (fontFamilyClassName) classList.push(fontFamilyClassName);
        if (classNames) classList.push(Object.values(classNames).join(" "));
        if (groupClassName) classList.push(groupClassName);
        if (props.className) classList.push(props.className);
        const finalClassName = classList.join(" ");
        const needsCssStyles = isReactNative || styleProps.isAnimated && driver?.isReactNative;
        if (styleProps.isAnimated && driver?.inputStyle === "css") {
          viewProps.className = finalClassName;
          if (style) {
            viewProps.style = style;
          }
        } else if (needsCssStyles) {
          let cnStyles;
          for (const name of finalClassName.split(" ")) {
            cnStyles ||= {
              $$css: true
            };
            cnStyles[name] = name;
          }
          viewProps.style = cnStyles ? [...(Array.isArray(style) ? style : [style]), cnStyles] : [style];
        } else {
          if (finalClassName) {
            viewProps.className = finalClassName;
          }
          if (style) {
            viewProps.style = style;
          }
        }
      } else {
        if (style) {
          viewProps.style = style;
        }
      }
    }
  }
  if (process.env.NODE_ENV === "development" && debug === "verbose") {
    if (isClient && isDevTools) {
      console.groupEnd();
      console.groupCollapsed("\u{1F539} getSplitStyles ===>");
      try {
        const logs = {
          ...result,
          className,
          componentState,
          viewProps,
          rulesToInsert,
          parentSplitStyles
        };
        for (const key in logs) {
          log(key, logs[key]);
        }
      } catch {}
      console.groupEnd();
    }
  }
  if (process.env.NODE_ENV === "development" && (debug === "profile" || globalThis.time)) {
    time`split-styles-done`;
  }
  return result;
};
function mergeFlatTransforms(target, flatTransforms) {
  Object.entries(flatTransforms).sort(([a], [b]) => sortString(a, b)).forEach(([key, val]) => {
    mergeTransform(target, key, val, true);
  });
}
function mergeStyle(styleState, key, val, importance, disableNormalize = false, originalVal) {
  const {
    viewProps,
    styleProps,
    staticConfig,
    usedKeys
  } = styleState;
  const existingImportance = usedKeys[key] || 0;
  if (existingImportance > importance) {
    return;
  }
  const contextProps = staticConfig.context?.props || staticConfig.parentStaticConfig?.context?.props;
  if (contextProps && key in contextProps) {
    styleState.overriddenContextProps ||= {};
    const originalFromState = styleState.originalContextPropValues?.[key];
    styleState.overriddenContextProps[key] = originalVal ?? originalFromState ?? val;
  }
  if (key in stylePropsTransform) {
    styleState.flatTransforms ||= {};
    usedKeys[key] = importance;
    styleState.flatTransforms[key] = val;
  } else {
    const shouldNormalize = isWeb && !disableNormalize && !styleProps.noNormalize;
    const out = shouldNormalize ? normalizeValueWithProperty(val, key) : val;
    if (
    // accept is for props not styles
    staticConfig.accept && key in staticConfig.accept) {
      viewProps[key] = out;
    } else {
      styleState.style ||= {};
      usedKeys[key] = importance;
      styleState.style[key] =
      // if you dont do this you'll be passing props.transform arrays directly here and then mutating them
      // if theres any flatTransforms later, causing issues (mutating props is bad, in strict mode styles get borked)
      key === "transform" && Array.isArray(out) ? [...out] : out;
    }
  }
}
const getSubStyle = (styleState, subKey, styleIn, avoidMergeTransform) => {
  const {
    staticConfig,
    conf: conf2,
    styleProps
  } = styleState;
  const styleOut = {};
  let originalValues;
  for (let key in styleIn) {
    const val = styleIn[key];
    key = conf2.shorthands[key] || key;
    if (key === "transition") {
      styleState.pseudoTransitions ||= {};
      styleState.pseudoTransitions[subKey] = val;
      const driver = styleState.animationDriver;
      if (driver?.outputStyle === "css") {
        const animationConfig = driver.animations?.[val];
        if (animationConfig) {
          const important = subKey[0] === "$" ? " !important" : "";
          styleOut["transition"] = `all ${animationConfig}${important}`;
        }
      }
      if (!styleOut["transition"] && typeof val === "string" && !driver?.animations?.[val]) {
        styleOut["transition"] = val;
      }
      continue;
    }
    const shouldSkip = !staticConfig.isHOC && key in skipProps && !styleProps.noSkip;
    if (shouldSkip) {
      continue;
    }
    propMapper(key, val, styleState, false, (skey, sval, originalVal) => {
      if (originalVal !== void 0) {
        originalValues ||= {};
        originalValues[skey] = originalVal;
      }
      if (skey in validPseudoKeys) {
        sval = getSubStyle(styleState, skey, sval, avoidMergeTransform);
      }
      if (!avoidMergeTransform && skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval);
      } else {
        styleOut[skey] = styleProps.noNormalize ? sval : normalizeValueWithProperty(sval, key);
      }
    });
  }
  if (!avoidMergeTransform) {
    const parentTransform = styleState.style?.transform;
    const flatTransforms = styleState.flatTransforms;
    const styleOutTransform = styleOut.transform;
    if (Array.isArray(styleOutTransform) && styleOutTransform.length) {
      const len = styleOutTransform.length;
      if (Array.isArray(parentTransform)) {
        const merged = [];
        outer: for (let i = 0; i < parentTransform.length; i++) {
          const pt = parentTransform[i];
          for (const pk in pt) {
            for (let j = 0; j < len; j++) {
              for (const sk in styleOutTransform[j]) {
                if (pk === sk) continue outer;
                break;
              }
            }
            merged.push(pt);
            break;
          }
        }
        for (let i = 0; i < len; i++) merged.push(styleOutTransform[i]);
        styleOut.transform = merged;
      }
      if (flatTransforms) {
        outer: for (const fk in flatTransforms) {
          const ck = fk === "x" ? "translateX" : fk === "y" ? "translateY" : fk;
          for (let j = 0; j < len; j++) {
            for (const sk in styleOutTransform[j]) {
              if (ck === sk) continue outer;
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
const useInsertEffectCompat = isWeb ? React.useInsertionEffect || useIsomorphicLayoutEffect : () => {};
const useSplitStyles = (a, b, c, d, e, f, g, h, i, j, k, l, m) => {
  "use no memo";

  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j, k, l, m);
  if (true) {
    useInsertEffectCompat(() => {
      if (res) {
        insertStyleRules(res.rulesToInsert);
      }
    }, [res?.rulesToInsert]);
  }
  return res;
};
function addStyleToInsertRules(rulesToInsert, styleObject) {
  if (true) {
    const identifier = styleObject[StyleObjectIdentifier];
    if (shouldInsertStyleRules(identifier)) {
      updateRules(identifier, styleObject[StyleObjectRules]);
      rulesToInsert[identifier] = styleObject;
    }
  }
}
const defaultColor = process.env.GUI_DEFAULT_COLOR || "rgba(0,0,0,0)";
const animatableDefaults = {
  ...Object.fromEntries(Object.entries(tokenCategories.color).map(([k, v]) => [k, defaultColor])),
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
const mergeTransform = (obj, key, val, backwards = false) => {
  if (typeof obj.transform === "string") {
    return;
  }
  obj.transform ||= [];
  obj.transform[backwards ? "unshift" : "push"]({
    [mapTransformKeys[key] || key]: val
  });
};
const mapTransformKeys = {
  x: "translateX",
  y: "translateY"
};
function passDownProp(viewProps, key, val, shouldMergeObject = false) {
  if (shouldMergeObject) {
    const next = {
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
  const usedKeys = styleState.usedKeys;
  let importance = getMediaImportanceIfMoreImportant(mediaKey, key, styleState, isSizeMedia);
  if (importanceBump) {
    const bumpedImportance = defaultMediaImportance + importanceBump;
    importance = !usedKeys[key] || bumpedImportance > usedKeys[key] ? bumpedImportance : null;
  }
  if (process.env.NODE_ENV === "development" && debugProp === "verbose") {
    log(`mergeMediaByImportance ${key} importance usedKey ${usedKeys[key]} next ${importance}`);
  }
  if (importance === null) {
    return false;
  }
  if (key in pseudoDescriptors) {
    const descriptor = pseudoDescriptors[key];
    const descriptorKey = descriptor.stateKey || descriptor.name;
    const isDisabled = styleState.componentState[descriptorKey] === false;
    if (isDisabled) {
      return false;
    }
    const pseudoOriginalValues = styleOriginalValues.get(value);
    for (const subKey in value) {
      mergeStyle(styleState, subKey, value[subKey], importance, false, pseudoOriginalValues?.[subKey]);
    }
  } else {
    mergeStyle(styleState, key, value, importance, false, originalVal);
  }
  return true;
}
function normalizeStyle(style) {
  const out = {};
  for (const key in style) {
    const val = style[key];
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
  const defaultValues = animatableDefaults[pkey];
  if (defaultValues != null && !(pkey in styleState.usedKeys) && (!styleState.style || !(pkey in styleState.style))) {
    mergeStyle(styleState, pkey, defaultValues, 1);
  }
}
export { PROP_SPLIT, getSplitStyles, getSubStyle, styleOriginalValues, useSplitStyles };
//# sourceMappingURL=getSplitStyles.mjs.map
