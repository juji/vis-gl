"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface ButtonProps {
  onClick?: () => void;
  active?: boolean;
  size?: number;
  disabled?: boolean;
  children: ReactNode; // The icon content
  className?: string;
  title?: string;
}

export function Button({
  onClick,
  active = false,
  size = 48,
  disabled = false,
  children,
  className = "",
  title,
}: ButtonProps) {
  return (
    <div className={styles.buttonContainer}>
      <button
        className={`${styles.button} ${active ? styles.active : ""} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        <div className={styles.icon}>{children}</div>
      </button>
      {title && <div className={styles.tooltip}>{title}</div>}
    </div>
  );
}
