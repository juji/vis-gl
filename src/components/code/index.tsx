import type { BundledLanguage, BundledTheme } from "shiki"; // Import the types from Shiki
import { codeToHtml } from "shiki";
import styles from "./styles.module.css";

export async function Code({
  code,
  lang = "typescript",
  theme = "aurora-x",
}: {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    theme,
  });

  return (
    <div
      className={styles.code}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
