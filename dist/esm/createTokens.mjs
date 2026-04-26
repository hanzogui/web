import { createVariables } from "./createVariables.mjs";
function createTokens(tokens) {
  return createVariables(tokens, process.env.GUI_TOKEN_PREFIX ?? "t");
}
export { createTokens };
//# sourceMappingURL=createTokens.mjs.map
