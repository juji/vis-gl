"use client";

import { Button } from "./button";

interface CircleButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
}

export function CircleButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
}: CircleButtonProps) {
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
        aria-label="Circle tool"
      >
        <title>Circle tool</title>
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
      </svg>
    </Button>
  );
}
