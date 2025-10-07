import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useRef } from "react";
import type { DrawingEntry } from "./types";

function wait(something: () => boolean, ms: number = 50) {
  return new Promise((resolve) =>
    setTimeout(() => {
      if (something()) resolve(true);
    }, ms),
  );
}

export function useRectangleDrawing() {
  const map = useMap();
  const geometryLib = useMapsLibrary("geometry");
  const currentBox = useRef<google.maps.Rectangle | null>(null);
  const lastTouchStartLoc = useRef<{ x: number; y: number } | null>(null);
  const runTouchEnd = useRef<(() => void) | null>(null);

  const startListeners = useCallback(
    (
      presentHistoryState: DrawingEntry[],
      setEntries: (entries: DrawingEntry[]) => void,
    ) => {
      if (!map) return;
      if (!geometryLib) return;

      function onFirstTouch(e: TouchEvent) {
        if (lastTouchStartLoc.current) return;
        lastTouchStartLoc.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }

      function onLastTouch(e: TouchEvent) {
        if (!lastTouchStartLoc.current) return;
        const dx = Math.abs(
          e.changedTouches[0].clientX - lastTouchStartLoc.current.x,
        );
        const dy = Math.abs(
          e.changedTouches[0].clientY - lastTouchStartLoc.current.y,
        );
        const distance = Math.sqrt(dx * dx + dy * dy);

        // if moved more than 10 pixels,
        // consider it a radius for the circle
        if (distance >= 10) {
          lastTouchStartLoc.current = null;
          if (runTouchEnd.current) {
            runTouchEnd.current();
            runTouchEnd.current = null;
          } else {
            wait(() => runTouchEnd.current != null, 50).then(() => {
              if (runTouchEnd.current) {
                runTouchEnd.current();
                runTouchEnd.current = null;
              }
            });
          }
        }
      }

      document.addEventListener("touchstart", onFirstTouch, false);
      document.addEventListener("touchend", onLastTouch, false);

      map.setOptions({ draggableCursor: "crosshair" });
      map.addListener("mousedown", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        // get last entry
        const lastEntry = presentHistoryState[presentHistoryState.length - 1];

        // start a new circle
        if (!lastEntry || lastEntry.type !== "rectangle" || lastEntry.done) {
          const newEntry: DrawingEntry = {
            type: "rectangle",
            points: [e.latLng],
            done: false,
          };
          setEntries([...presentHistoryState, newEntry]);
          return;
        }
      });

      map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        if (!currentBox.current) return;
        const lastEntry = presentHistoryState[presentHistoryState.length - 1];

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(lastEntry.points[0]);
        bounds.extend(e.latLng);
        currentBox.current.setBounds(bounds);
      });

      map.addListener("mouseup", (e: google.maps.MapMouseEvent) => {
        console.log("mouseup", e.latLng?.toString());

        // lastTouchStartLoc.current

        const run = () => {
          if (!e.latLng) return;
          if (!currentBox.current) return;

          const lastEntry = presentHistoryState[presentHistoryState.length - 1];
          const radius = google.maps.geometry.spherical.computeDistanceBetween(
            lastEntry.points[0],
            e.latLng,
          );

          if (radius < 1) {
            // too small, ignore
            return;
          }

          setEntries([
            ...presentHistoryState.slice(0, -1),
            {
              type: "rectangle",
              points: [lastEntry.points[0], e.latLng],
              done: true,
            },
          ]);
        };

        if (lastTouchStartLoc.current) {
          runTouchEnd.current = run;
        } else {
          run();
        }
      });

      return () => {
        map.setOptions({ draggableCursor: "" });
        google.maps.event.clearListeners(map, "mousedown");
        google.maps.event.clearListeners(map, "mousemove");
        google.maps.event.clearListeners(map, "mouseup");
        document.removeEventListener("touchstart", onFirstTouch);
        document.removeEventListener("touchend", onLastTouch);
        currentBox.current = null;
      };
    },
    [map, geometryLib],
  );

  const draw = useCallback(
    (
      entry: DrawingEntry,
      onChange?: (entry: DrawingEntry) => void,
      _isLastOfType = false,
    ) => {
      if (!map) return;
      if (!geometryLib) return;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(entry.points[0]);
      bounds.extend(entry.points[1] ? entry.points[1] : entry.points[0]);

      const rectangle = new google.maps.Rectangle({
        bounds: bounds,
        strokeColor: "#FF00FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF00FF",
        fillOpacity: 0.35,
        clickable: true,
        editable: entry.done,
      });
      rectangle.setMap(map);

      if (!entry.done) {
        currentBox.current = rectangle;
      }

      const listeners: google.maps.MapsEventListener[] = [];

      listeners.push(
        google.maps.event.addListener(
          rectangle,
          "mouseup",
          (e: google.maps.MapMouseEvent) => {
            console.log("rectangle mouseup", e.latLng?.toString());

            if (entry.done) return; // only if not done
            if (!e.latLng) return;

            const run = () => {
              if (entry.done) return; // only if not done
              if (!e.latLng) return;

              const radius =
                google.maps.geometry.spherical.computeDistanceBetween(
                  entry.points[0],
                  e.latLng,
                );

              if (radius < 1) {
                // too small, ignore
                return;
              }

              // update rectangle
              onChange?.({
                ...entry,
                points: [entry.points[0], e.latLng],
                done: true,
              });
            };

            if (lastTouchStartLoc.current) {
              runTouchEnd.current = run;
            } else {
              run();
            }
          },
        ),
      );

      listeners.push(
        google.maps.event.addListener(
          rectangle,
          "mousemove",
          (e: google.maps.MapMouseEvent) => {
            if (entry.done) return; // only if not done
            if (!e.latLng) return;
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(entry.points[0]);
            bounds.extend(e.latLng);
            rectangle.setBounds(bounds);
          },
        ),
      );

      function updatePoints() {
        // remove undo icon
        const undo = document.querySelector(
          'img[src$="undo_poly.png"]',
        ) as HTMLImageElement;
        if (undo) undo.style.display = "none";

        if (!entry.done) return;
        const newBounds = rectangle.getBounds();
        if (newBounds) {
          const ne = newBounds.getNorthEast();
          const sw = newBounds.getSouthWest();
          onChange?.({
            ...entry,
            points: [sw, ne],
            done: true,
          });
        }
      }

      listeners.push(
        google.maps.event.addListener(
          rectangle,
          "bounds_changed",
          updatePoints,
        ),
      );
      return { shape: rectangle, listeners };
    },
    [map, geometryLib],
  );

  return {
    draw,
    startListeners,
  };
}
