"use client";

import { Button } from "./button";

interface RectangleButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
}

export function RectangleButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
}: RectangleButtonProps) {
  return (
    <Button onClick={onClick} active={active} size={size} disabled={disabled}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "60%",
          height: "60%",
          transition: "transform 0.2s ease",
        }}
        aria-label="Rectangle tool"
      >
        <title>Rectangle tool</title>
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="7"
          y="9"
          width="10"
          height="6"
          rx="1"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    </Button>
  );
}
