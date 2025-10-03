"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface CustomMarkerProps {
  title?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
  animation?: "bounce" | "pulse" | "none";
}

function MarkerTooltip({ onClose }: { onClose: () => void }) {
  const [showAllImages, setShowAllImages] = useState(false);

  const images = [
    "/placeholder1.jpg",
    "/placeholder2.jpg",
    "/placeholder3.jpg",
    "/placeholder4.jpg",
    "/placeholder5.jpg",
    "/placeholder6.jpg",
  ];

  const displayedImages = showAllImages ? images : images.slice(0, 3);

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeader}>
        <h3>Check it out!</h3>
        <button onClick={onClose} className={styles.tooltipClose} type="button">
          ×
        </button>
      </div>
      <div className={styles.tooltipImages}>
        {displayedImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Random photo ${index + 1}`}
            width={80}
            height={60}
          />
        ))}
      </div>
      <div className={styles.tooltipActions}>
        <button
          onClick={() => setShowAllImages(!showAllImages)}
          className={styles.showAllButton}
          type="button"
        >
          {showAllImages ? "Show Less" : "Show All"}
        </button>
      </div>
      <div className={styles.tooltipText}>
        <p>Some random photos found on the internet.</p>
      </div>
    </div>
  );
}

export default function CustomMarker({
  title,
  className = "",
  size = 52,
  color = "#4285F4",
}: CustomMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [animation, setAnimation] = useState<"bounce" | "none">("bounce");

  const handleClick = () => {
    if (!showTooltip) setShowTooltip(!showTooltip);
  };

  useEffect(() => {
    if (showTooltip) {
      setAnimation("none");
    } else {
      setAnimation("bounce");
    }
  }, [showTooltip]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <button
        className={`${styles.customMarker} ${className} ${animation !== "none" ? styles[animation] : ""}`}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "0%",
          transform: "translate(-50%, 0%)",
          zIndex: 100,
          cursor: "pointer",
          border: "none",
          background: "none",
          padding: 0,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={title}
        type="button"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.markerIcon}
          aria-label="Map marker"
        >
          <title>Map marker</title>
          {/* Pin shape */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill={color}
            stroke="white"
            strokeWidth="1"
          />
          {/* Pin point */}
          <circle cx="12" cy="9" r="3" fill="white" />
        </svg>
      </button>
      {showTooltip && <MarkerTooltip onClose={() => setShowTooltip(false)} />}
    </>
  );
}
