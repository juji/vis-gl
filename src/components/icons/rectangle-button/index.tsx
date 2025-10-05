"use client";

import styles from "./styles.module.css";

interface RectangleButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function RectangleButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
}: RectangleButtonProps) {
  return (
    <button
      className={`${styles.rectangleButton} ${active ? styles.active : ""}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.rectangleIcon}
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
    </button>
  );
}
