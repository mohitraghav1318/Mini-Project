"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles, Send, RotateCcw, Bot, User } from "lucide-react";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./DoubtBot.module.scss";
import { useDoubtBot } from "./hooks/useDoubtBot";

export default function DoubtBot({ courseId }) {
  const t = useTranslations("courses");
  const {
    isOpen,
    question,
    language,
    messages,
    isAsking,
    error,
    failedQuery,
    toggle,
    setQuestion,
    setLanguage,
    handleSubmit,
    handleRetry,
    clearChat,
  } = useDoubtBot(courseId);

  return (
    <section className={styles.panel} aria-label={t("doubtBot.heading")}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Sparkles size={18} aria-hidden="true" />
          <h2>{t("doubtBot.heading")}</h2>
        </div>
        <Button type="button" variant="secondary" onClick={toggle}>
          {t(isOpen ? "doubtBot.hideLabel" : "doubtBot.askLabel")}
        </Button>
        {isOpen && messages.length > 0 && (
          <Button type="button" variant="secondary" onClick={clearChat} disabled={isAsking}>
            {t("doubtBot.clearLabel")}
          </Button>
        )}
      </div>

      {isOpen && (
        <div className={styles.body}>
          <p className={styles.hint}>{t("doubtBot.hint")}</p>

          {messages.length === 0 && !isAsking && (
            <p className={styles.empty} role="status">
              {t("doubtBot.empty")}
            </p>
          )}

          <div className={styles.messages} role="log" aria-live="polite">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className={`${styles.bubble} ${styles.userBubble}`}>
                  <span className={styles.bubbleIcon} aria-hidden="true">
                    <User size={14} />
                  </span>
                  <p>{message.text}</p>
                </div>
              ) : (
                <div key={message.id} className={`${styles.bubble} ${styles.aiBubble}`}>
                  <span className={styles.bubbleIcon} aria-hidden="true">
                    <Bot size={14} />
                  </span>
                  <div className={styles.aiContent}>
                    <span className={styles.aiBadge}>{t("doubtBot.aiBadge")}</span>
                    <p>{message.text}</p>
                    {message.answerKind === "general" && (
                      <p className={styles.sources}>{t("doubtBot.generalLabel")}</p>
                    )}
                    {message.grounded && message.sources?.length > 0 && (
                      <p className={styles.sources}>
                        {t("doubtBot.sourcesLabel")}:{" "}
                        {message.sources.map((source) => source.title).join(", ")}
                      </p>
                    )}
                    {!message.grounded && (
                      <Link href={`/courses/${courseId}/community`} className={styles.communityLink}>
                        {t("doubtBot.communityLink")}
                      </Link>
                    )}
                  </div>
                </div>
              )
            )}

            {isAsking && (
              <div className={`${styles.bubble} ${styles.aiBubble}`} role="status">
                <span className={styles.spinner} aria-hidden="true" />
                <p>{t("doubtBot.thinking")}</p>
              </div>
            )}
          </div>

          <FormMessage type="error" message={error} />
          {error && failedQuery && !isAsking && (
            <div className={styles.retryRow}>
              <Button type="button" variant="secondary" onClick={handleRetry}>
                <RotateCcw size={15} aria-hidden="true" /> {t("doubtBot.retryLabel")}
              </Button>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.langRow} role="group" aria-label={t("doubtBot.languageLabel")}>
              {["hi", "en"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.langBtn} ${language === option ? styles.langBtnActive : ""}`}
                  onClick={() => setLanguage(option)}
                  aria-pressed={language === option}
                >
                  {t(`doubtBot.language${option === "hi" ? "Hi" : "En"}`)}
                </button>
              ))}
            </div>
            <div className={styles.inputRow}>
              <textarea
                className={styles.textarea}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={t("doubtBot.inputPlaceholder")}
                rows={2}
                maxLength={500}
                disabled={isAsking}
                aria-label={t("doubtBot.inputPlaceholder")}
              />
              <Button type="submit" isLoading={isAsking} disabled={!question.trim()}>
                <Send size={15} aria-hidden="true" /> {t("doubtBot.sendLabel")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
