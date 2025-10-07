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

export function useCircleDrawing() {
  const map = useMap();
  const geometryLib = useMapsLibrary("geometry");
  const currentCircle = useRef<google.maps.Circle | null>(null);
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
        if (!lastEntry || lastEntry.type !== "circle" || lastEntry.done) {
          const newEntry: DrawingEntry = {
            type: "circle",
            points: [e.latLng],
            done: false,
          };
          setEntries([...presentHistoryState, newEntry]);
          return;
        }
      });

      map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        if (!currentCircle.current) return;

        const center = currentCircle.current.getCenter();
        if (!center) return;

        const radius = google.maps.geometry.spherical.computeDistanceBetween(
          center,
          e.latLng,
        );

        if (radius < 1) {
          // too small, ignore
          return;
        }

        currentCircle.current.setRadius(radius);
      });

      map.addListener("mouseup", (e: google.maps.MapMouseEvent) => {
        // lastTouchStartLoc.current

        const run = () => {
          if (!e.latLng) return;
          if (!currentCircle.current) return;

          const center = currentCircle.current.getCenter();
          if (!center) return;

          const radius = google.maps.geometry.spherical.computeDistanceBetween(
            center,
            e.latLng,
          );

          if (radius < 1) {
            // too small, ignore
            return;
          }

          setEntries([
            ...presentHistoryState.slice(0, -1),
            {
              type: "circle",
              points: [center, e.latLng],
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
        currentCircle.current?.setMap(null);
        currentCircle.current = null;
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

      const center = entry.points[0];
      const radiusPoint = entry.points[1];
      const radius = radiusPoint
        ? google.maps.geometry.spherical.computeDistanceBetween(
            center,
            radiusPoint,
          )
        : 1;

      const circle = new google.maps.Circle({
        center: center,
        radius: radius,
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.35,
        clickable: true,
        editable: entry.done,
      });

      if (!entry.done) {
        currentCircle.current = circle;
      }

      circle.setMap(map);

      const listeners: google.maps.MapsEventListener[] = [];

      function updatePoints() {
        if (!entry.done) return; // only if done

        // remove undo icon
        const undo = document.querySelector(
          'img[src$="undo_poly.png"]',
        ) as HTMLImageElement;
        if (undo) undo.style.display = "none";

        const newCenter = circle.getCenter();
        const newRadius = circle.getRadius();
        if (newCenter) {
          const radiusLat = newCenter.lat() + newRadius / 111320; // Approximate meters to degrees
          const newRadiusPoint = new google.maps.LatLng(
            radiusLat,
            newCenter.lng(),
          );
          onChange?.({
            ...entry,
            points: [newCenter, newRadiusPoint],
          });
        }
      }

      listeners.push(
        google.maps.event.addListener(
          circle,
          "mouseup",
          (e: google.maps.MapMouseEvent) => {
            const run = () => {
              if (entry.done) return; // only if not done
              const center = circle.getCenter();
              if (!center || !e.latLng) return;

              const radius =
                google.maps.geometry.spherical.computeDistanceBetween(
                  entry.points[0],
                  e.latLng,
                );

              if (radius < 1) {
                // too small, ignore
                return;
              }

              // update radius point
              onChange?.({
                ...entry,
                points: [center, e.latLng],
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
          circle,
          "mousemove",
          (e: google.maps.MapMouseEvent) => {
            if (entry.done) return; // only if not done
            const center = circle.getCenter();
            if (!center || !e.latLng) return;

            const radius =
              google.maps.geometry.spherical.computeDistanceBetween(
                entry.points[0],
                e.latLng,
              );

            if (radius < 1) {
              // too small, ignore
              return;
            }

            circle.setRadius(radius);
          },
        ),
      );

      listeners.push(
        google.maps.event.addListener(circle, "center_changed", updatePoints),
      );
      listeners.push(
        google.maps.event.addListener(circle, "radius_changed", updatePoints),
      );

      return { shape: circle, listeners };
    },
    [map, geometryLib],
  );

  return {
    draw,
    startListeners,
  };
}
