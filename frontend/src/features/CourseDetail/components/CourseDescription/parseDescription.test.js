// Focused unit tests for the course description parser.
// Run with: node --test src/features/CourseDetail/components/CourseDescription/parseDescription.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseDescription, HINDI_SEPARATOR } from "./parseDescription.js";

const START = "----- AI course outline (generated, editable) -----";
const END = "----- End of AI course outline -----";
const MARKERS = [START, END];

const RICH = [
  "A simple guide to making papads at home.",
  "",
  `${HINDI_SEPARATOR}`,
  "घर पर पापड़ बनाने की आसान विधि।",
  "",
  "Learning objectives:",
  "- Pick fresh vegetables",
  "- Maintain hygiene",
  "",
  "Lesson plan:",
  "1. Selecting ingredients — pick fresh stock.",
  "2. Drying papads",
  "",
  "Key takeaways:",
  "- Keep hands safe",
  "",
  "Quick quiz:",
  "1. What holds thread?",
  "   a) Bobbin ✓",
].join("\n");

describe("parseDescription", () => {
  it("parses intro, Hindi, objectives, plan, and takeaways", () => {
    const blocks = parseDescription(RICH, MARKERS);
    const kinds = blocks.map((b) => b.kind);
    assert.deepEqual(kinds, ["paragraph", "paragraph", "objectives", "plan", "takeaways"]);
    assert.equal(blocks[0].lang, "en");
    assert.equal(blocks[1].lang, "hi");
    assert.deepEqual(blocks[2].items, ["Pick fresh vegetables", "Maintain hygiene"]);
    assert.deepEqual(blocks[3].items, [
      "Selecting ingredients — pick fresh stock.",
      "Drying papads",
    ]);
    assert.deepEqual(blocks[4].items, ["Keep hands safe"]);
  });

  it("never renders quiz content or markers", () => {
    const text = parseDescription(RICH, MARKERS)
      .map((b) => b.text || b.items.join(" "))
      .join(" ");
    assert.ok(!text.includes("Quick quiz:"));
    assert.ok(!text.includes("What holds thread?"));
    assert.ok(!text.includes("✓"));
    assert.ok(!text.includes(START));
    assert.ok(!text.includes(END));
  });

  it("strips managed markers from new-format blocks", () => {
    const withMarkers = `${START}\n\n${RICH}\n\n${END}`;
    const blocks = parseDescription(withMarkers, MARKERS);
    assert.equal(blocks[0].text, "A simple guide to making papads at home.");
  });

  it("keeps plain-text descriptions as paragraphs", () => {
    const blocks = parseDescription("Just a simple description.\nStill one thought.", MARKERS);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].kind, "paragraph");
  });

  it("keeps inline label-like prose as ordinary text", () => {
    const blocks = parseDescription("My Lesson plan: is flexible.", MARKERS);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].kind, "paragraph");
  });

  it("handles missing sections, empty, and non-string input", () => {
    assert.deepEqual(parseDescription("", MARKERS), []);
    assert.deepEqual(parseDescription("   ", MARKERS), []);
    assert.deepEqual(parseDescription(null, MARKERS), []);
    assert.deepEqual(parseDescription(undefined, MARKERS), []);
    const partial = parseDescription("Intro only.\n\nKey takeaways:\n- One thing", MARKERS);
    assert.deepEqual(
      partial.map((b) => b.kind),
      ["paragraph", "takeaways"]
    );
  });

  it("ends a list on plain lines instead of swallowing them", () => {
    const blocks = parseDescription(
      "Learning objectives:\n- First item\nA closing remark.",
      MARKERS
    );
    assert.deepEqual(
      blocks.map((b) => b.kind),
      ["objectives", "paragraph"]
    );
    assert.equal(blocks[1].text, "A closing remark.");
  });

describe("flattened legacy format (newline loss)", () => {
  // Exact shape of the affected production description with newlines lost.
  const FLAT = [
    "Stitching Course ----- AI course outline (generated, editable) ----- This course teaches stitching.",
    "--- हिन्दी विवरण --- यह कोर्स सिलाई सिखाता है। Learning objectives: - Identify tools - Master stitching - Take measurements Lesson plan: 1. Knowing Your Tools — identify needles. 2. Mastering the Machine — thread and sew. Key takeaways: - Repair at home - Take orders Quick quiz: 1. What holds thread? a) Bobbin ✓ b) Needle ----- End of AI course outline -----",
  ].join(" ");

  it("1. strips inline markers", () => {
    const text = parseDescription(FLAT, MARKERS)
      .map((b) => b.text || b.items.join(" "))
      .join(" ");
    assert.ok(!text.includes("AI course outline"));
    assert.ok(!text.includes("End of AI course outline"));
  });

  it("2. separates Hindi from English", () => {
    const blocks = parseDescription(FLAT, MARKERS);
    const hindi = blocks.filter((b) => b.lang === "hi");
    assert.ok(hindi.length > 0);
    assert.ok(hindi[0].text.includes("सिलाई"));
    const first = blocks[0];
    assert.equal(first.kind, "paragraph");
    assert.ok(!first.text.includes("सिलाई"));
  });

  it("3+4. splits inline headings and hyphen-joined items", () => {
    const blocks = parseDescription(FLAT, MARKERS);
    const byKind = Object.fromEntries(blocks.map((b) => [b.kind, b]));
    assert.deepEqual(byKind.objectives.items, ["Identify tools", "Master stitching", "Take measurements"]);
    assert.deepEqual(byKind.takeaways.items, ["Repair at home", "Take orders"]);
  });

  it("5. splits multiple numbered lessons on one line", () => {
    const blocks = parseDescription(FLAT, MARKERS);
    const plan = blocks.find((b) => b.kind === "plan");
    assert.deepEqual(plan.items, [
      "Knowing Your Tools — identify needles.",
      "Mastering the Machine — thread and sew.",
    ]);
  });

  it("6. removes quiz questions and answers", () => {
    const text = parseDescription(FLAT, MARKERS)
      .map((b) => b.text || b.items.join(" "))
      .join(" ");
    assert.ok(!text.includes("What holds thread?"));
    assert.ok(!text.includes("Bobbin"));
    assert.ok(!text.includes("✓"));
  });

  it("7. keeps hyphenated prose and label-like phrases intact", () => {
    const blocks = parseDescription(
      "My Lesson plan: is flexible. A well-known tailor works here.",
      MARKERS
    );
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].kind, "paragraph");
    assert.ok(blocks[0].text.includes("well-known"));
  });

  it("does not split decimals or stray numbers", () => {
    const blocks = parseDescription(
      "Lesson plan:\nTake 1.5 hours to practice step 2. revision.",
      MARKERS
    );
    const plan = blocks.find((b) => b.kind === "plan");
    assert.equal(plan, undefined);
    assert.ok(blocks.some((b) => b.kind === "paragraph" && b.text.includes("1.5 hours")));
  });

  it("supports legacy numbered and dash variants", () => {
    const blocks = parseDescription(
      "Lesson plan:\n1) Cut the cloth\n2) Stitch slowly",
      MARKERS
    );
    assert.equal(blocks[0].kind, "plan");
    assert.deepEqual(blocks[0].items, ["Cut the cloth", "Stitch slowly"]);
  });
});
});
