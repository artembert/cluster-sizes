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
});
