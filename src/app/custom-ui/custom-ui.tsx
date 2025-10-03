"use client";

import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useRef } from "react";
import { Joystick } from "@/components/joystick";
import { SimpleMap } from "@/components/maps/simple";

function JoystickControl() {
  const map = useMap();
  const xy = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const handleJoystickChange = useCallback(
    (x: number, y: number) => {
      if (!map) return;

      xy.current = { x, y };

      if (raf.current) {
        return;
      }

      function move() {
        const { x, y } = xy.current;

        if (map) {
          const center = map.getCenter();
          const zoom = map.getZoom();

          if (center && zoom) {
            const latitude = center.lat();
            const latRad = (latitude * Math.PI) / 180;

            // Calculate meters per pixel at current zoom and latitude
            const metersPerPixel =
              (156543.03392 * Math.cos(latRad)) / 2 ** zoom;

            // Convert pixel deltas to meter deltas
            const pixelSpeed = 10; // pixels per frame
            const deltaX = x * pixelSpeed; // pixels
            const deltaY = y * pixelSpeed; // pixels

            const metersX = deltaX * metersPerPixel;
            const metersY = deltaY * metersPerPixel;

            // Convert meters to degrees
            // 1 degree latitude = ~111,319.5 meters
            // 1 degree longitude = 111,319.5 * cos(latitude) meters
            const metersPerDegreeLat = 111319.5;
            const metersPerDegreeLng = 111319.5 * Math.cos(latRad);

            const deltaLat = metersY / metersPerDegreeLat;
            const deltaLng = metersX / metersPerDegreeLng;

            // Calculate new position
            const newLat = latitude + deltaLat;
            const newLng = center.lng() + deltaLng;

            // Set new center
            map.setCenter({ lat: newLat, lng: newLng });
          }
        }

        raf.current = requestAnimationFrame(move);
      }

      raf.current = requestAnimationFrame(move);
    },
    [map],
  );

  const handleJoystickRelease = useCallback(() => {
    // No action needed on release
    xy.current = { x: 0, y: 0 };
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  }, []);

  return (
    <Joystick
      size={120}
      onChange={handleJoystickChange}
      onRelease={handleJoystickRelease}
    />
  );
}

export function CustomUi() {
  return (
    <SimpleMap height="500px">
      <MapControl position={ControlPosition.BOTTOM_CENTER}>
        <JoystickControl />
      </MapControl>
    </SimpleMap>
  );
}
