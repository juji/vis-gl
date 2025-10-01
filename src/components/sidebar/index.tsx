"use client";

import Link from "next/link";
import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <div className={styles.sidebarHeader}>
        <h2>vis.gl Experiments</h2>
      </div>

      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <Link href="/" className={styles.navLink}>
              Overview
            </Link>
          </li>
          <li>
            <Link href="/examples" className={styles.navLink}>
              Examples
            </Link>
          </li>
          <li>
            <Link href="/documentation" className={styles.navLink}>
              Documentation
            </Link>
          </li>
          <li>
            <Link href="/components" className={styles.navLink}>
              Components
            </Link>
          </li>
          <li>
            <Link href="/settings" className={styles.navLink}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.version}>v1.0.0</p>
      </div>
    </aside>
  );
}
