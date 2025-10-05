"use client";

import styles from "./styles.module.css";

interface PolygonButtonProps {
  onClick?: () => void;
  className?: string;
  size?: number;
  disabled?: boolean;
}

export default function PolygonButton({
  onClick,
  className = "",
  size = 48,
  disabled = false,
}: PolygonButtonProps) {
  return (
    <button
      className={`${styles.polygonButton} ${className}`}
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
        className={styles.polygonIcon}
        aria-label="Polygon tool"
      >
        <title>Polygon tool</title>
        <path
          d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Inner geometric pattern */}
        <path
          d="M12 6L16 8.5V13.5L12 16L8 13.5V8.5L12 6Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </button>
  );
}
