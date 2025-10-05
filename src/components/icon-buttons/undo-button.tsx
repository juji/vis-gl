"use client";

import { Button } from "./button";

interface UndoButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
  title?: string;
}

export function UndoButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
  title,
}: UndoButtonProps) {
  return (
    <Button
      onClick={onClick}
      active={active}
      size={size}
      disabled={disabled}
      title={title}
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
        aria-label="Undo"
      >
        <title>Undo</title>
        <path
          d="M3 7v6h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}