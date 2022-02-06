import { getZoomLevelByMetersAndPixels } from "./get-zoom-level-by-meters-and-pixels.helper";

describe("getZoomLevelByMetersAndPixels", () => {
  describe("px: 1, lat: 0", () => {
    test("zoomLevel 4", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 9_783.94, px: 1, lat: 0 })
      ).toBeCloseTo(4, 0);
    });

    test("zoomLevel 9", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 305.75, px: 1, lat: 0 })
      ).toBeCloseTo(9, 0);
    });

    test("zoomLevel 13", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 19.11, px: 1, lat: 0 })
      ).toBeCloseTo(13, 0);
    });
  });

  describe("px: 1, lat: various", () => {
    test("zoomLevel 4", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 8473, px: 1, lat: 30 })
      ).toBeCloseTo(4, 0);
    });

    test("zoomLevel 9", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 153, px: 1, lat: 60 })
      ).toBeCloseTo(9, 0);
    });

    test("zoomLevel 13", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 8, px: 1, lat: 65 })
      ).toBeCloseTo(13, 0);
    });
  });

  describe("px: various, lat: various", () => {
    test("zoomLevel 4", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 228775, px: 27, lat: 30 })
      ).toBeCloseTo(4, 0);
    });

    test("zoomLevel 9", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 20485, px: 134, lat: 60 })
      ).toBeCloseTo(9, 0);
    });

    test("zoomLevel 13", () => {
      expect(
        getZoomLevelByMetersAndPixels({ meters: 646, px: 80, lat: 65 })
      ).toBeCloseTo(13, 0);
    });
  });
});
