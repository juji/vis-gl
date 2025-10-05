export type DrawingTool = "polygon" | "line" | "circle" | "rectangle" | null;

export type DrawingEntry = {
  type: DrawingTool;
  points: google.maps.LatLng[];
};
