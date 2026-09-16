"use client";
import {useTranslations} from "next-intl";import {Quote as QuoteIcon} from "lucide-react";import styles from "./Quote.module.scss";export default function Quote(){const t=useTranslations("home.quote");return <section className={styles.section}><QuoteIcon size={44}/><blockquote>“{t("text")}”</blockquote><p>{t("author")}</p></section>}
