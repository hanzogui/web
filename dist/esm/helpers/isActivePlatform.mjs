import { currentPlatform, isAndroid, isIos, isTV } from "@hanzogui/constants";
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
    platform === currentPlatform ||
    // native matches all non-web platforms (iOS, Android, tvOS, Android TV)
    platform === "native" && currentPlatform !== "web" ||
    // GUI_TARGET fallback (web or native build target)
    platform === "web" ||
    // tv matches both Android TV and tvOS
    platform === "tv" && isTV ||
    // androidtv matches Android TV specifically
    platform === "androidtv" && isAndroid && isTV ||
    // tvos matches tvOS specifically
    platform === "tvos" && isIos && isTV
  );
}
export { getPlatformSpecificityBump, isActivePlatform };
//# sourceMappingURL=isActivePlatform.mjs.map
