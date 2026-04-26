import { expectTypeOf, describe, test } from "vitest";
describe("AnimationsConfig types", function () {
  test("AnimationsConfig accepts single driver", function () {
    expectTypeOf().toMatchTypeOf();
  });
  test("AnimationsConfig accepts multi-driver object", function () {
    expectTypeOf().toMatchTypeOf();
  });
  test("AnimationsConfigObject requires default key", function () {
    expectTypeOf().toMatchTypeOf();
    expectTypeOf().toMatchTypeOf();
  });
});
describe("CreateGuiConfig animation types", function () {
  test("CreateGuiConfig.animations accepts single driver", function () {
    var _driver = {};
  });
  test("CreateGuiConfig.animations accepts multi-driver object", function () {
    var _multi = {};
  });
});
describe("TransitionKeys inference", function () {
  test("TransitionKeys type exists and is string-based", function () {
    expectTypeOf().toMatchTypeOf();
  });
});
describe("AnimationDriverKeys inference", function () {
  test("AnimationDriverKeys is string or string union", function () {
    expectTypeOf().toMatchTypeOf();
  });
  test("TypeOverride.animationDrivers exists in interface", function () {
    expectTypeOf().toBeFunction();
  });
  test("AnimationDriverKeys always includes default", function () {
    expectTypeOf().toMatchTypeOf();
  });
});
describe("animatedBy prop", function () {
  test("animatedBy exists on GuiComponentPropsBaseBase", function () {
    expectTypeOf().toHaveProperty("animatedBy");
  });
  test("animatedBy accepts null", function () {
    expectTypeOf().toMatchTypeOf();
  });
  test('animatedBy accepts "default"', function () {
    expectTypeOf().toMatchTypeOf();
  });
  test("multi-driver config type flow preserves all driver keys", function () {
    expectTypeOf().toMatchTypeOf();
    expectTypeOf().toMatchTypeOf();
  });
});
describe("Type regression scenarios", function () {
  test("single driver config scenario", function () {});
  test("multiple drivers config scenario - CreateGuiConfig accepts it", function () {
    var _config = {};
  });
  test("TypeOverride combines with inferred", function () {
    expectTypeOf().toMatchTypeOf();
  });
  test("combined multiple drivers and override", function () {
    expectTypeOf().toMatchTypeOf();
  });
});
describe("ExtractAnimationDriverKeys helper", function () {
  test('single driver returns "default"', function () {
    expectTypeOf().toEqualTypeOf();
  });
  test("multi-driver returns all keys", function () {
    expectTypeOf().toMatchTypeOf();
    expectTypeOf().toMatchTypeOf();
  });
  test("multi-driver with css key returns all keys", function () {
    expectTypeOf().toMatchTypeOf();
    expectTypeOf().toMatchTypeOf();
  });
});
//# sourceMappingURL=animationDriverTypes.test-d.native.js.map
