"use client";

import { Button } from "./button";

interface RedoButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
  title?: string;
  noOutline?: boolean;
}

export function RedoButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
  title,
  noOutline = true,
}: RedoButtonProps) {
  return (
    <Button
      onClick={onClick}
      active={active}
      size={size}
      disabled={disabled}
      title={title}
      noOutline={noOutline}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "60%",
          height: "60%",
          transition: "transform 0.2s ease",
        }}
        aria-label="Redo"
      >
        <title>Redo</title>
        <path
          d="M21 7v6h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}
