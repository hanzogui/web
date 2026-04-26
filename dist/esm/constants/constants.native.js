var THEME_NAME_SEPARATOR = "_";
var THEME_CLASSNAME_PREFIX = "t_";
var FONT_DATA_ATTRIBUTE_NAME = "data-gui-font";
var MISSING_THEME_MESSAGE = process.env.NODE_ENV === "development" ? `Can't find GUI configuration.
    
Most of the time this is due to having mis-matched versions of GUI dependencies, or bundlers somehow duplicating them.
First step is to ensure every "@hanzo/gui" and "@hanzogui/*" dependency is on the same version, we have a CLI tool to help: 

  npx @hanzogui/cli check
` : `Missing theme.`;
export { FONT_DATA_ATTRIBUTE_NAME, MISSING_THEME_MESSAGE, THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR };
//# sourceMappingURL=constants.native.js.map
