import { setConfigFont } from "./config.native.js";
import { FONT_DATA_ATTRIBUTE_NAME } from "./constants/constants.native.js";
import { createFont } from "./createFont.native.js";
import { createVariables } from "./createVariables.native.js";
import { registerCSSVariable, variableToCSS } from "./helpers/registerCSSVariable.native.js";
function insertFont(name, fontIn) {
  var font = createFont(fontIn);
  var tokened = createVariables(font, name);
  var parsed = parseFont(tokened);
  if (false) {
    var fontVars = registerFontVariables(parsed);
    var styleElement = document.querySelector(`style[${FONT_DATA_ATTRIBUTE_NAME}="${name}"]`) || document.createElement("style");
    styleElement.innerText = `:root .font_${name} {${fontVars.join(";")}}`;
    styleElement.setAttribute(FONT_DATA_ATTRIBUTE_NAME, name);
    document.head.appendChild(styleElement);
  }
  setConfigFont(name, tokened, parsed);
  return parsed;
}
var updateFont = insertFont;
function parseFont(definition) {
  var parsed = {};
  for (var attrKey in definition) {
    var attr = definition[attrKey];
    if (attrKey === "family" || attrKey === "face") {
      parsed[attrKey] = attr;
    } else {
      parsed[attrKey] = {};
      for (var key in attr) {
        var _val_val;
        var val = attr[key];
        if (((_val_val = val.val) === null || _val_val === void 0 ? void 0 : _val_val[0]) === "$") {
          val = val.val;
        }
        parsed[attrKey][`$${key}`] = val;
      }
    }
  }
  return parsed;
}
function registerFontVariables(parsedFont) {
  if (!process.env.GUI_DID_OUTPUT_CSS) {
    var response = [];
    for (var fkey in parsedFont) {
      if (fkey === "face") continue;
      if (fkey === "family") {
        var val = parsedFont[fkey];
        registerCSSVariable(val);
        response.push(variableToCSS(val));
      } else {
        for (var fskey in parsedFont[fkey]) {
          var fval = parsedFont[fkey][fskey];
          if (typeof fval === "string") {} else {
            var val1 = parsedFont[fkey][fskey];
            registerCSSVariable(val1);
            response.push(variableToCSS(val1));
          }
        }
      }
    }
    return response;
  }
  return [];
}
export { insertFont, parseFont, registerFontVariables, updateFont };
//# sourceMappingURL=insertFont.native.js.map
