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
var isActivePlatform_exports = {};
__export(isActivePlatform_exports, {
  getPlatformSpecificityBump: () => getPlatformSpecificityBump,
  isActivePlatform: () => isActivePlatform
});
module.exports = __toCommonJS(isActivePlatform_exports);
var import_constants = require("@hanzogui/constants");
function getPlatformSpecificityBump(mediaKeyShort) {
  if (mediaKeyShort === "platform-androidtv" || mediaKeyShort === "platform-tvos") return 3;
  if (mediaKeyShort === "platform-tv") return 2;
  if (mediaKeyShort === "platform-android" || mediaKeyShort === "platform-ios") return 1;
  return 0;
}
function isActivePlatform(key) {
  if (!key.startsWith("$platform")) {
    return true;
  }
  const platform = key.slice(10);
  return (
    // exact platform match (web, ios, android)
    platform === import_constants.currentPlatform ||
    // native matches all non-web platforms (iOS, Android, tvOS, Android TV)
    platform === "native" && import_constants.currentPlatform !== "web" ||
    // GUI_TARGET fallback (web or native build target)
    platform === "web" ||
    // tv matches both Android TV and tvOS
    platform === "tv" && import_constants.isTV ||
    // androidtv matches Android TV specifically
    platform === "androidtv" && import_constants.isAndroid && import_constants.isTV ||
    // tvos matches tvOS specifically
    platform === "tvos" && import_constants.isIos && import_constants.isTV
  );
}