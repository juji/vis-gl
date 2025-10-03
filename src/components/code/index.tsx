import type { BundledLanguage, BundledTheme } from "shiki"; // Import the types from Shiki
import { codeToHtml } from "shiki";
import styles from "./styles.module.css";

export async function Code({
  children,
  clean,
  lang = "typescript",
  theme = "aurora-x",
}: {
  children: string;
  clean?: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
}) {
  const html = await codeToHtml(
    children
      .trim()
      .split("\n")
      .map((v) => v.replace(clean || "", ""))
      .join("\n"),
    {
      lang,
      theme,
    },
  );

  return (
    <div
      className={styles.code}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
