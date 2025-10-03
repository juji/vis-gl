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
  {
    label: "UI",
    children: [
      { href: "/default-ui", label: "Default UI" },
      { href: "/custom-ui-placement", label: "Custom UI Placement" },
      { href: "/custom-ui", label: "Custom UI" },
    ],
  },
  {
    label: "Markers",
    children: [{ href: "/simple-marker", label: "Simple Marker" }],
  },
];

function MenuItemComponent({
  item,
  level = 0,
  onLinkClick,
}: {
  item: MenuItem;
  level?: number;
  onLinkClick: () => void;
}) {
  const pathname = usePathname();

  const hasActiveDescendant = (menuItem: MenuItem): boolean => {
    if (menuItem.href === pathname) return true;
    if (menuItem.children) {
      return menuItem.children.some(hasActiveDescendant);
    }
    return false;
  };

  const [isExpanded, setIsExpanded] = useState(() => {
    if (item.children && item.children.length > 0) {
      return item.children.some(hasActiveDescendant);
    }
    return false;
  });
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  if (hasChildren) {
    return (
      <div className={styles.menuGroup}>
        <button
          type="button"
          className={`${styles.menuItem} ${styles.menuButton} ${level > 0 ? styles.nested : ""}`}
          onClick={toggleExpanded}
          style={{ paddingLeft: `${1.5 + level * 1}rem` }}
        >
          <span className={styles.menuLabel}>{item.label}</span>
          <span
            className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`}
          >
            ›
          </span>
        </button>
        <div
          className={`${styles.submenu} ${isExpanded ? styles.submenuOpen : ""}`}
        >
          {item.children?.map((child, index) => (
            <MenuItemComponent
              key={`${child.label}-${index}`}
              item={child}
              level={level + 1}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onLinkClick}
      className={`${styles.menuItem} ${isActive ? styles.active : ""} ${level > 0 ? styles.nested : ""}`}
      style={{ paddingLeft: `${1.5 + level * 1}rem` }}
      {...(item.newTab && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {item.label}
    </Link>
  );
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <MenuItemComponent
              key={`${item.label}-${index}`}
              item={item}
              onLinkClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className={styles.footer}>
          <span>v1.0.0</span>
        </div>
      </aside>
    </>
  );
}
