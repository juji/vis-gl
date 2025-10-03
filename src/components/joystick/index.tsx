"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface JoystickProps {
  size?: number;
  onChange?: (x: number, y: number) => void;
  onRelease?: (x: number, y: number) => void;
  className?: string;
}

export function Joystick({
  size = 120,
  onChange,
  onRelease,
  className = "",
}: JoystickProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = size / 2 - 20; // Leave some margin for the handle

      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      const x = clampedDistance * Math.cos(angle);
      const y = clampedDistance * Math.sin(angle);

      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;

      setPosition({ x, y });
      setIsDragging(true);
      onChange?.(normalizedX, normalizedY);
    },
    [size, onChange],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = size / 2 - 20;

      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      const x = clampedDistance * Math.cos(angle);
      const y = clampedDistance * Math.sin(angle);

      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;

      setPosition({ x, y });
      onChange?.(normalizedX, normalizedY);
    },
    [isDragging, size, onChange],
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    const normalizedX = position.x / (size / 2 - 20);
    const normalizedY = position.y / (size / 2 - 20);

    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    onRelease?.(normalizedX, normalizedY);
  }, [isDragging, position, size, onRelease]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove],
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    },
    [handleEnd],
  );

  // Add global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchEnd,
    handleTouchMove,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${styles.joystick} ${className}`}
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Joystick control"
      aria-valuenow={0}
      tabIndex={0}
    >
      <div className={styles.base}>
        <div
          className={styles.handle}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
