import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";

export type DrawingTool = "polygon" | "line" | "circle" | "rectangle" | null;
export type DrawingEntry = { type: DrawingTool; points: google.maps.LatLng[] };

function useHistory() {
  const [historyState, setHistoryState] = useState<{
    past: Array<DrawingEntry[]>;
    present: { type: DrawingTool; points: google.maps.LatLng[] }[];
    future: Array<{ type: DrawingTool; points: google.maps.LatLng[] }[]>;
  }>({
    past: [],
    present: [],
    future: [],
  });

  const [hasUndo, setHasUndo] = useState(false);
  const [hasRedo, setHasRedo] = useState(false);

  function undo() {
    if (historyState.past.length === 0) return;
    const previous = historyState.past[historyState.past.length - 1];
    const newPast = historyState.past.slice(0, historyState.past.length - 1);
    const newHistoryState = {
      past: newPast,
      present: previous,
      future: [historyState.present, ...historyState.future],
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  function redo() {
    if (historyState.future.length === 0) return;
    const next = historyState.future[0];
    const newFuture = historyState.future.slice(1);
    const newHistoryState = {
      past: [...historyState.past, historyState.present],
      present: next,
      future: newFuture,
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  function addEntry(
    entry: { type: DrawingTool; points: google.maps.LatLng[] }[],
  ) {
    const newHistoryState = {
      past: [...historyState.past, historyState.present],
      present: entry,
      future: [],
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  return {
    undo,
    redo,
    addEntry,
    hasUndo,
    hasRedo,
    present: historyState.present,
  };
}

function usePolygonDrawing() {
  const map = useMap();

  const onClick = useCallback(
    (latLng: google.maps.LatLng, entries: DrawingEntry[]) => {
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry || lastEntry.type !== "polygon") {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
        entries.push(newEntry);
        return entries;
      }

      // already closed, create new polygon
      if (
        lastEntry.points[0].equals(
          lastEntry.points[lastEntry.points.length - 1],
        ) &&
        lastEntry.points.length > 2
      ) {
        const newEntry: DrawingEntry = { type: "polygon", points: [latLng] };
        entries.push(newEntry);
        return entries;
      }

      // add the point
      entries[entries.length - 1].points.push(latLng);
      return entries;
    },
    [],
  );

  const draw = useCallback(
    (
      points: google.maps.LatLng[],
      onChange?: (points: google.maps.LatLng[]) => void,
    ) => {
      if (!map) return;

      const isClosedPolygon =
        points.length > 2 && points[0].equals(points[points.length - 1]);
      if (isClosedPolygon) {
        const entryPoints = [...points.slice(0, -1)];
        const polygon = new google.maps.Polygon({
          paths: entryPoints,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          clickable: true,
          editable: true,
        });
        polygon.setMap(map);
        function getPaths() {
          onChange?.([
            ...polygon.getPath().getArray(),
            points[points.length - 1],
          ]);
        }
        google.maps.event.addListener(polygon, "dragend", getPaths);
        google.maps.event.addListener(polygon.getPath(), "insert_at", getPaths);
        google.maps.event.addListener(polygon.getPath(), "remove_at", getPaths);
        google.maps.event.addListener(polygon.getPath(), "set_at", getPaths);
        return polygon;
      } else {
        const polyline = new google.maps.Polyline({
          path: points,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          clickable: true,
          editable: true,
        });
        polyline.setMap(map);
        polyline.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            // check if first point is clicked
            // if so, close the polygon
            const firstPoint = polyline.getPath().getAt(0);
            if (firstPoint?.equals(e.latLng)) {
              onChange?.([
                ...polyline.getPath().getArray(),
                polyline.getPath().getAt(0),
              ]);
            }
          }
        });

        function getPaths() {
          onChange?.(polyline.getPath().getArray());
        }
        google.maps.event.addListener(polyline, "dragend", getPaths);
        google.maps.event.addListener(
          polyline.getPath(),
          "insert_at",
          getPaths,
        );
        google.maps.event.addListener(
          polyline.getPath(),
          "remove_at",
          getPaths,
        );
        google.maps.event.addListener(polyline.getPath(), "set_at", getPaths);
        return polyline;
      }
    },
    [map],
  );

  return {
    draw,
    onClick,
  };
}

export function useDrawController(drawingTool: DrawingTool) {
  const map = useMap();

  const {
    undo,
    redo,
    addEntry: addHistoryEntry,
    hasUndo,
    hasRedo,
    present: presentHistoryState,
  } = useHistory();

  const [entries, setEntries] = useState<DrawingEntry[]>([]);
  const objects = useRef<
    (
      | google.maps.Polygon
      | google.maps.Polyline
      | google.maps.Circle
      | google.maps.Rectangle
    )[]
  >([]);

  const { draw: drawPolygon, onClick: onPolygonClick } = usePolygonDrawing();

  // Save to history
  // biome-ignore lint/correctness/useExhaustiveDependencies: will loop on every change
  useEffect(() => {
    if (entries.length === 0) return;
    const entryCopy = entries.map((v) => ({
      type: v.type,
      points: [...v.points],
    }));
    addHistoryEntry(entryCopy);
  }, [entries]);

  useEffect(() => {
    // Clear existing objects
    objects.current.forEach((obj) => {
      obj.setMap(null);
    });

    objects.current = [];

    presentHistoryState.forEach((entry) => {
      if (entry.type === "polygon") {
        const polygon = drawPolygon(entry.points, (newPoints) => {
          const newEntries = presentHistoryState.map((e) => {
            if (e === entry) {
              return { ...e, points: newPoints };
            }
            return e;
          });
          setEntries(newEntries);
        });
        polygon && objects.current.push(polygon);
      }
      // Implement other shapes (line, circle, rectangle) similarly
    });
  }, [presentHistoryState, drawPolygon]);

  useEffect(() => {
    if (!map) return;
    if (!drawingTool) {
      map.setOptions({ draggableCursor: "" });
      google.maps.event.clearListeners(map, "click");
      return;
    }

    map.setOptions({ draggableCursor: "crosshair" });
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      if (drawingTool === "polygon") {
        const newEntries = onPolygonClick(e.latLng, entries);
        console.log("Polygon drawing entries:", newEntries);
        newEntries && setEntries([...newEntries]);
      }
    });

    return () => {
      map.setOptions({ draggableCursor: "" });
      google.maps.event.clearListeners(map, "click");
    };
  }, [map, drawingTool, entries, onPolygonClick]);

  // This hook can be expanded to manage drawing state if needed
  return {
    undo,
    redo,
    hasUndo,
    hasRedo,
  };
}
