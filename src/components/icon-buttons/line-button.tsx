"use client";

import { Button } from "./button";

interface LineButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
  title?: string;
}

export function LineButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
  title,
}: LineButtonProps) {
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
        aria-label="Line tool"
      >
        <title>Line tool</title>
        <path
          d="M4 12L20 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="4" cy="12" r="2" fill="currentColor" />
        <circle cx="20" cy="12" r="2" fill="currentColor" />
      </svg>
    </Button>
  );
}
