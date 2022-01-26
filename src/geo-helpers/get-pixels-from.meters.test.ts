import { getPixelsFromMeters } from "./get-pixels-from.meters";

describe("getPixelsFromMeters", () => {
  test("zoomLevel 2", () => {
    expect(
      +getPixelsFromMeters({ zoomLevel: 2, meters: 39135.76, lat: 0 }).toFixed(
        0
      )
    ).toBeCloseTo(1, 0);
  });

  test("zoomLevel 4", () => {
    expect(
      +getPixelsFromMeters({ zoomLevel: 4, meters: 9783.94, lat: 0 }).toFixed(0)
    ).toBeCloseTo(1, 0);
  });
});
