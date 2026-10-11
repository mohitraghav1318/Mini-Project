"use client";

import { useTranslations } from "next-intl";
import { parseDescription } from "./parseDescription";
import { MANAGED_START, MANAGED_END } from "@/features/AdminCourses/components/AiAssistant/outlineToCourse";
import styles from "./CourseDescription.module.scss";

const HEADING_KEYS = {
  objectives: "detail.descObjectives",
  plan: "detail.descLessonPlan",
  takeaways: "detail.descTakeaways",
};

// Renders a course description as structured sections instead of one text
// block. Internal AI markers are stripped, quiz sections are skipped by the
// parser, and every string renders as a text node (no HTML interpretation).
// Unparseable input falls back to plain readable text.
export default function CourseDescription({ description }) {
  const t = useTranslations("courses");
  const text = typeof description === "string" ? description : "";
  const blocks = parseDescription(text, [MANAGED_START, MANAGED_END]);

  if (blocks.length === 0) {
    return <p className={styles.plain}>{text}</p>;
  }

  return (
    <div className={styles.description}>
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          const isHindi = block.lang === "hi";
          return (
            <p
              key={index}
              lang={isHindi ? "hi" : undefined}
              className={isHindi ? `${styles.paragraph} ${styles.hindi}` : styles.paragraph}
            >
              {isHindi && <span className={styles.hindiBadge}>{t("detail.descHindi")}</span>}
              {block.text}
            </p>
          );
        }
        const ListTag = block.kind === "plan" ? "ol" : "ul";
        return (
          <section key={index} className={styles.section} aria-label={t(HEADING_KEYS[block.kind])}>
            <h3 className={styles.heading}>{t(HEADING_KEYS[block.kind])}</h3>
            <ListTag className={block.kind === "plan" ? styles.ordered : styles.unordered}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} lang={block.lang === "hi" ? "hi" : undefined}>
                  {item}
                </li>
              ))}
            </ListTag>
          </section>
        );
      })}
    </div>
  );
}
