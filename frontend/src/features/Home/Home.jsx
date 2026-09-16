"use client";

/**
 * Layer 1 — Page Container
 *
 * Pure composer: imports the locale-aware data hook (Layer 3) and
 * renders each section component (Layer 2) in sequence.
 * Contains zero business logic, zero JSX markup of its own.
 */

import styles from "./Home.module.scss";
import { useHomeData } from "./hooks/useHomeData";

import HeroSection from "./components/HeroSection/HeroSection";
import HowToJoin   from "./components/HowToJoin/HowToJoin";
import Testimonial from "./components/Testimonial/Testimonial";
import FaqSection  from "./components/FaqSection/FaqSection";
import HomeFooter  from "./components/HomeFooter/HomeFooter";

export default function Home() {
  const { hero, chips, steps, testimonial, faq, cta, footer, headings } =
    useHomeData();

  return (
    <main className={styles.home}>
      <HeroSection slides={hero?.slides} chips={chips} />
      <HowToJoin   steps={steps}         headings={headings} />
      <Testimonial {...testimonial} />
      <FaqSection  questions={faq}       headings={headings} />
      <HomeFooter  cta={cta}             footer={footer} />
    </main>
  );
}
