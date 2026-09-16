"use client";
import { useTranslations } from "next-intl";
import Hero from "./components/Hero/Hero";
import HowToJoin from "./components/HowToJoin/HowToJoin";
import WhyJoin from "./components/WhyJoin/WhyJoin";
import AboutUs from "./components/AboutUs/AboutUs";
import Quote from "./components/Quote/Quote";
import Cta from "./components/Cta/Cta";
import styles from "./Home.module.scss";
export default function Home(){const t=useTranslations("home");return <main className={styles.home}><Hero/><HowToJoin/><WhyJoin/><AboutUs/><Quote/><Cta/><footer className={styles.footer}>{t("footer")}</footer></main>}
