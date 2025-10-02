"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

const Links = [
  { href: "/", label: "Simple" },
  { href: "/tracking-changes", label: "Tracking Changes" },
  { href: "/draw-marker", label: "Draw Marker" },
  { href: "/components", label: "Components" },
];

export default function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        // biome-ignore lint/a11y/useSemanticElements: just no
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${className}`}
      >
        <div className={styles.header}>
          <h2>vis.gl Experiments</h2>
        </div>

        <nav className={styles.nav}>
          {Links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={pathname === href ? styles.active : ""}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <span>v1.0.0</span>
        </div>
      </aside>
    </>
  );
}
