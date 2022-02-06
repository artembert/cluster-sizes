import { getMetersPerPixel } from "./get-meters-per-pixel.helper";

describe("getMetersPerPixel", () => {
  test("zoomLevel 0", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 0, px: 1, lat: 0 }).toFixed(0)
    ).toEqual(156_543);
  });
  test("zoomLeve1", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 1, px: 1, lat: 0 }).toFixed(0)
    ).toBeCloseTo(78_271, -1);
  });
  test("zoomLevel 4", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 4, px: 10, lat: 0 }).toFixed(0)
    ).toBeCloseTo(9_7830, -2);
  });
  test("zoomLevel 10", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 10, px: 1, lat: 0 }).toFixed(0)
    ).toBeCloseTo(152, -1);
  });
  test("zoomLevel 13", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 13, px: 1, lat: 0 }).toFixed(0)
    ).toBeCloseTo(19, 0);
  });
  test("zoomLevel 18", () => {
    expect(
      +getMetersPerPixel({ zoomLevel: 18, px: 1, lat: 0 }).toFixed(0)
    ).toBeCloseTo(0.6, 0);
  });
});
