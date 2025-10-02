"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  href?: string;
  label: string;
  newTab?: boolean;
  children?: MenuItem[];
}

const Links: MenuItem[] = [
  { href: "/", label: "Simple" },
  { href: "/tracking-changes", label: "Tracking Changes" },
  { href: "/draw-marker", label: "Draw Marker" },
  {
    label: "Components",
    children: [
      { href: "/components/sidebar", label: "Sidebar" },
      { href: "/components/navbar", label: "Navbar", newTab: true },
      { href: "/components/footer", label: "Footer" },
      {
        label: "Custom",
        children: [
          { href: "/components/custom/card", label: "Card" },
          { href: "/components/custom/button", label: "Button" },
        ],
      },
    ],
  },
];

export default function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const MenuItem = ({
    item,
    level = 0,
  }: {
    item: MenuItem;
    level?: number;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isActive = item.href === pathname;

    if (hasChildren) {
      return (
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={`${styles.menuItem} ${styles.menuButton} ${level > 0 ? styles.nested : ""}`}
            onClick={() => toggleExpanded(item.label)}
            style={{ paddingLeft: `${1.5 + level * 1}rem` }}
          >
            <span className={styles.menuLabel}>{item.label}</span>
            <span
              className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`}
            >
              ›
            </span>
          </button>
          {isExpanded && (
            <div className={styles.submenu}>
              {item.children?.map((child, index) => (
                <MenuItem
                  key={`${child.label}-${index}`}
                  item={child}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href || "#"}
        onClick={() => setIsOpen(false)}
        className={`${styles.menuItem} ${isActive ? styles.active : ""} ${level > 0 ? styles.nested : ""}`}
        style={{ paddingLeft: `${1.5 + level * 1}rem` }}
        {...(item.newTab && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {item.label}
      </Link>
    );
  };

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
          {Links.map((item, index) => (
            <MenuItem key={`${item.label}-${index}`} item={item} />
          ))}
        </nav>

        <div className={styles.footer}>
          <span>v1.0.0</span>
        </div>
      </aside>
    </>
  );
}
