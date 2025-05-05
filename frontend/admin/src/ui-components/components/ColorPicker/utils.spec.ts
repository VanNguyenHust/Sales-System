import { describe, expect, it } from "vitest";

import { HSBColor, RGBColor } from "./types";
import { hexToRgb, hsbToRgb, rgbToHex, rgbToHsb } from "./utils";

const redHex = "#ff0000";

const redHsb: HSBColor = {
  brightness: 1,
  hue: 0,
  saturation: 1,
};

const redRgb: RGBColor = {
  red: 255,
  green: 0,
  blue: 0,
};

describe("transform color", () => {
  it("should transform color", () => {
    expect(hexToRgb(redHex)).toEqual(redRgb);
    expect(rgbToHex(redRgb)).toEqual(redHex);
    expect(rgbToHsb(redRgb)).toMatchObject(redHsb);
    expect(hsbToRgb(redHsb)).toMatchObject(redRgb);
  });
});
