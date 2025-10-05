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
  noOutline?: boolean;
}

export function Button({
  onClick,
  active = false,
  size = 48,
  disabled = false,
  children,
  className = "",
  title,
  noOutline = false,
}: ButtonProps) {
  return (
    <div className={styles.buttonContainer}>
      <button
        className={`${styles.button} ${active ? styles.active : ""} ${noOutline ? styles.noOutline : ""} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          outline: noOutline ? 'none' : undefined,
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
