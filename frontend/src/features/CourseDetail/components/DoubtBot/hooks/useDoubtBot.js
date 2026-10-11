"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { askDoubt } from "../../../data/doubtBot";

let nextId = 1;

export function useDoubtBot(courseId) {
  const t = useTranslations("courses");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState(locale === "hi" ? "hi" : "en");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState(null);
  const [failedQuery, setFailedQuery] = useState(null);

  function toggle() {
    setIsOpen((current) => !current);
  }

  async function send(currentQuestion, currentLanguage) {
    const trimmed = (currentQuestion || "").trim();
    if (!trimmed || isAsking) return;

    setIsAsking(true);
    setError(null);
    setFailedQuery(null);
    const userMessage = { id: nextId++, role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");

    try {
      const response = await askDoubt(courseId, {
        question: trimmed,
        language: currentLanguage,
      });
      const data = response?.data;
      setMessages((current) => [
        ...current,
        {
          id: nextId++,
          role: "assistant",
          text: data?.answer || t("doubtBot.error"),
          grounded: data?.grounded !== false,
          sources: data?.sources || [],
        },
      ]);
    } catch (err) {
      setError(err.message || t("doubtBot.error"));
      setFailedQuery({ question: trimmed, language: currentLanguage });
    } finally {
      setIsAsking(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(question, language);
  }

  function handleRetry() {
    if (!failedQuery) return;
    setError(null);
    send(failedQuery.question, failedQuery.language);
  }

  return {
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
  };
}
