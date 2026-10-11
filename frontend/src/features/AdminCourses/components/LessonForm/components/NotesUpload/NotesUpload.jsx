"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { extractLessonNotes } from "@/lib/courseApi";
import Button from "@/components/Button/Button";
import FormMessage from "@/components/FormMessage/FormMessage";
import styles from "./NotesUpload.module.scss";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function NotesUpload({ courseId, onExtracted }) {
  const t = useTranslations("adminCourses");
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  function handleFileSelect(event) {
    setError(null);
    setNotice(null);
    const file = event.target.files?.[0];
    if (!file) {
      setFileName("");
      return;
    }
    const lowerName = file.name.toLowerCase();
    const supported = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    if (!supported) {
      setError(t("notesUpload.unsupported"));
      setFileName("");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t("notesUpload.tooLarge"));
      setFileName("");
      event.target.value = "";
      return;
    }
    setFileName(file.name);
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file || isUploading) return;
    setIsUploading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await extractLessonNotes(courseId, file);
      const text = response?.data?.text || "";
      if (!text) {
        throw new Error(t("notesUpload.empty"));
      }
      onExtracted?.(text);
      setNotice(t("notesUpload.extracted", { count: response?.data?.charCount ?? text.length }));
      if (fileRef.current) fileRef.current.value = "";
      setFileName("");
    } catch (err) {
      setError(err.message || t("notesUpload.error"));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={styles.uploadBox}>
      <label className={styles.label} htmlFor="lesson-notes-file">
        {t("notesUpload.label")}
      </label>
      <p className={styles.hint}>{t("notesUpload.hint")}</p>
      <div className={styles.row}>
        <input
          id="lesson-notes-file"
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className={styles.fileInput}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleUpload}
          isLoading={isUploading}
          disabled={!fileName}
        >
          {isUploading ? t("notesUpload.uploading") : t("notesUpload.upload")}
        </Button>
      </div>
      <FormMessage type="error" message={error} />
      <FormMessage type="success" message={notice} />
    </div>
  );
}
