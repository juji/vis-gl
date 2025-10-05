"use client";

import styles from "./styles.module.css";

interface LineButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function LineButton({
  onClick,
  active = false,
  size = 48,
  disabled = false,
}: LineButtonProps) {
  return (
    <button
      className={`${styles.lineButton} ${active ? styles.active : ""}`}
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
        className={styles.lineIcon}
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
    </button>
  );
}
