"use client";

import styles from "./styles.module.css";

interface CircleButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function CircleButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
}: CircleButtonProps) {
  return (
    <button
      className={`${styles.circleButton} ${active ? styles.active : ""}`}
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
        className={styles.circleIcon}
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
    </button>
  );
}
