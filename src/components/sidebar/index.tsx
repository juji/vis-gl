"use client";

import styles from "./styles.module.css";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <div className={styles.sidebarHeader}>
        <h2>vis.gl</h2>
      </div>

      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <a href="#overview" className={styles.navLink}>
              Overview
            </a>
          </li>
          <li>
            <a href="#examples" className={styles.navLink}>
              Examples
            </a>
          </li>
          <li>
            <a href="#documentation" className={styles.navLink}>
              Documentation
            </a>
          </li>
          <li>
            <a href="#components" className={styles.navLink}>
              Components
            </a>
          </li>
          <li>
            <a href="#settings" className={styles.navLink}>
              Settings
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.version}>v1.0.0</p>
      </div>
    </aside>
  );
}
