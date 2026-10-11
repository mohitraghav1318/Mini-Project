"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import Input from "@/components/Input/Input";
import SearchableSelect from "@/components/SearchableSelect/SearchableSelect";
import { OCCUPATION_KEYS } from "@/features/Auth/Register/data/register.data";
import styles from "./AiCourseAssistant.module.scss";
import { useAiCourseAssistant } from "./hooks/useAiCourseAssistant";

export default function AiCourseAssistant({ onApply, mode = "create", initialCourse = null }) {
  const t = useTranslations("adminCourses");
  const tOccupations = useTranslations("occupations");
  const {
    isOpen,
    isEdit,
    request,
    context,
    updateTitle,
    replaced,
    isGenerating,
    error,
    outline,
    draft,
    applied,
    toggle,
    handleRequestChange,
    handleSelectChange,
    handleDraftChange,
    handleContextChange,
    handleGenerate,
    handleApply,
    setUpdateTitle,
  } = useAiCourseAssistant(onApply, { mode, initialCourse });

  const occupationOptions = OCCUPATION_KEYS.map((key) => ({
    value: key,
    label: tOccupations(key),
  }));

  const levelOptions = ["beginner", "intermediate", "advanced"].map((level) => ({
    value: level,
    label: t(`ai.level${level.charAt(0).toUpperCase()}${level.slice(1)}`),
  }));

  const languageOptions = [
    { value: "both", label: t("ai.languageBoth") },
    { value: "en", label: t("ai.languageEn") },
    { value: "hi", label: t("ai.languageHi") },
  ];

  return (
    <section className={styles.cardPanel} aria-label={t(isEdit ? "ai.improveHeading" : "ai.heading")}>
      <div className={styles.cardHeader}>
        <h2>{t(isEdit ? "ai.improveHeading" : "ai.heading")}</h2>
        <Button type="button" variant="secondary" onClick={toggle}>
          {t(isOpen ? "ai.hideLabel" : "ai.toggleLabel")}
        </Button>
      </div>

      {isOpen && (
        <div className={styles.body}>
          <p className={styles.hint}>{t(isEdit ? "ai.contextHint" : "ai.hint")}</p>

          <form className={styles.form} onSubmit={handleGenerate} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.fieldCol}>
                <Input
                  name="topic"
                  label={t("ai.topicLabel")}
                  type="text"
                  placeholder={t("ai.topicPlaceholder")}
                  required
                  value={request.topic}
                  onChange={handleRequestChange}
                />
              </div>

              <div className={styles.fieldCol}>
                <SearchableSelect
                  name="occupation"
                  label={t("ai.occupationLabel")}
                  placeholder={t("ai.occupationPlaceholder")}
                  required
                  value={request.occupation}
                  onChange={(value) => handleSelectChange("occupation", value)}
                  options={occupationOptions}
                />
              </div>

              <div className={styles.fieldCol}>
                <SearchableSelect
                  name="level"
                  label={t("ai.levelLabel")}
                  placeholder={t("ai.levelLabel")}
                  value={request.level}
                  onChange={(value) => handleSelectChange("level", value)}
                  options={levelOptions}
                />
              </div>

              <div className={styles.fieldCol}>
                <SearchableSelect
                  name="language"
                  label={t("ai.languageLabel")}
                  placeholder={t("ai.languageLabel")}
                  value={request.language}
                  onChange={(value) => handleSelectChange("language", value)}
                  options={languageOptions}
                />
              </div>

              {isEdit && (
                <div className={styles.fieldCol}>
                  <Input
                    name="lessonCount"
                    label={t("ai.lessonsLabel")}
                    type="number"
                    required
                    value={request.lessonCount}
                    onChange={handleRequestChange}
                  />
                </div>
              )}
            </div>

            {isEdit && (
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="ai-context">
                  {t("ai.contextLabel")}
                </label>
                <textarea
                  id="ai-context"
                  name="context"
                  className={styles.textarea}
                  placeholder={t("ai.contextPlaceholder")}
                  value={context}
                  onChange={handleContextChange}
                  rows={4}
                  maxLength={2000}
                />
              </div>
            )}

            <div className={styles.actions}>
              <Button type="submit" isLoading={isGenerating}>
                {isGenerating
                  ? t("ai.generatingLabel")
                  : outline
                    ? t("ai.regenerateLabel")
                    : t("ai.generateLabel")}
              </Button>
            </div>
          </form>

          <FormMessage type="error" message={error} />
          <FormMessage
            type="success"
            message={applied ? t(isEdit ? "ai.appliedEdit" : "ai.applied") : null}
          />
          {applied && isEdit && replaced && (
            <p className={styles.hint} role="status">
              {t("ai.replaceSectionsNote")}
            </p>
          )}

          {!outline && !error && !isGenerating && (
            <p className={styles.empty} role="status">
              {t("ai.empty")}
            </p>
          )}

          {isGenerating && (
            <div className={styles.loadingContainer} role="status">
              <div className={styles.spinner} />
              <p>{t("ai.generatingLabel")}</p>
            </div>
          )}

          {outline && (
            <div className={styles.preview}>
              <div className={`${styles.fieldCol} ${styles.fullWidth}`}>
                <Input
                  name="title"
                  label={t("ai.titleLabel")}
                  type="text"
                  value={draft.title}
                  onChange={handleDraftChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="ai-descriptionEn">
                  {t("ai.descriptionEnLabel")}
                </label>
                <textarea
                  id="ai-descriptionEn"
                  name="descriptionEn"
                  className={styles.textarea}
                  value={draft.descriptionEn}
                  onChange={handleDraftChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="ai-descriptionHi">
                  {t("ai.descriptionHiLabel")}
                </label>
                <textarea
                  id="ai-descriptionHi"
                  name="descriptionHi"
                  className={styles.textarea}
                  value={draft.descriptionHi}
                  onChange={handleDraftChange}
                />
              </div>

              {outline.objectives?.length > 0 && (
                <div className={styles.previewBlock}>
                  <h3>{t("ai.objectivesLabel")}</h3>
                  <ul>
                    {outline.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {outline.lessons?.length > 0 && (
                <div className={styles.previewBlock}>
                  <h3>{t("ai.lessonsLabel")}</h3>
                  <ol>
                    {outline.lessons.map((lesson, index) => (
                      <li key={index}>
                        <strong>{lesson.title}</strong>
                        {lesson.summary && <p>{lesson.summary}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {outline.takeaways?.length > 0 && (
                <div className={styles.previewBlock}>
                  <h3>{t("ai.takeawaysLabel")}</h3>
                  <ul>
                    {outline.takeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}

              {outline.quiz?.length > 0 && (
                <div className={styles.previewBlock}>
                  <h3>{t("ai.quizLabel")}</h3>
                  <ol>
                    {outline.quiz.map((item, index) => (
                      <li key={index}>
                        <strong>{item.question}</strong>
                        <ul>
                          {item.options.map((option, optionIndex) => (
                            <li
                              key={optionIndex}
                              className={
                                optionIndex === item.answerIndex ? styles.correctOption : undefined
                              }
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className={styles.actions}>
                {isEdit && (
                  <label className={styles.checkRow}>
                    <input
                      type="checkbox"
                      checked={updateTitle}
                      onChange={(event) => setUpdateTitle(event.target.checked)}
                    />
                    {t("ai.updateTitleLabel")}
                  </label>
                )}
                <Button type="button" variant="secondary" onClick={handleApply}>
                  {t(isEdit ? "ai.applyEditLabel" : "ai.applyLabel")}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
