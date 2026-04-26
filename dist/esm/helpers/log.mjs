import { _disableMediaTouch } from "../hooks/useMedia.mjs";
function log(...args) {
  if (process.env.NODE_ENV === "production") return;
  _disableMediaTouch(true);
  try {
    if (true) {
      return console.info(...args);
    }
    return console.log(...args);
  } catch (err) {
    console.error(err);
  } finally {
    _disableMediaTouch(false);
  }
}
export { log };
//# sourceMappingURL=log.mjs.map
