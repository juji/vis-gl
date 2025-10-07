import styles from "./styles.module.css";

interface TechnicalSection {
  emoji: string;
  title: string;
  content: React.ReactNode;
}

interface TechnicalHighlightsProps {
  sections: TechnicalSection[];
}

export default function TechnicalHighlights({
  sections,
}: TechnicalHighlightsProps) {
  return (
    <div className={styles.technicalDetails}>
      <h2>Technical Highlights</h2>
      <div className={styles.techGrid}>
        {sections.map((section) => (
          <div key={section.title} className={styles.techSection}>
            <h3>
              {section.emoji} {section.title}
            </h3>
            <div className={styles.content}>{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
