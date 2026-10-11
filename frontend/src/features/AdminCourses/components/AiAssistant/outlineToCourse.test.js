// Focused unit tests for the AI outline merge helper.
// Run with: node --test src/features/AdminCourses/components/AiAssistant/outlineToCourse.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildCourseDescription,
  buildManagedBlock,
  mergeOutlineIntoDescription,
  MANAGED_START,
  MANAGED_END,
} from "./outlineToCourse.js";

const OUTLINE_A = {
  title: "Basic Tailoring",
  descriptionEn: "Learn stitching basics.",
  descriptionHi: "सिलाई की बुनियाद सीखें।",
  objectives: ["Thread a machine"],
  lessons: [{ order: 1, title: "Know your machine", summary: "Identify parts." }],
  takeaways: ["Keep hands safe"],
  quiz: [{ question: "What holds thread below?", options: ["Bobbin", "Needle"], answerIndex: 0 }],
};
const DRAFT_A = {
  title: OUTLINE_A.title,
  descriptionEn: OUTLINE_A.descriptionEn,
  descriptionHi: OUTLINE_A.descriptionHi,
};

const OUTLINE_B = {
  ...OUTLINE_A,
  descriptionEn: "Advanced stitching guide.",
  objectives: ["Sew a full blouse"],
  lessons: [{ order: 1, title: "Cutting cloth", summary: "Measure twice." }],
};

describe("buildCourseDescription (create flow unchanged)", () => {
  it("contains every generated section except the quiz", () => {
    const text = buildCourseDescription(OUTLINE_A, DRAFT_A);
    for (const section of [
      "Learn stitching basics.",
      "सिलाई की बुनियाद सीखें।",
      "Learning objectives:",
      "Lesson plan:",
      "Know your machine — Identify parts.",
      "Key takeaways:",
    ]) {
      assert.ok(text.includes(section), `missing: ${section}`);
    }
    assert.ok(!text.includes("Quick quiz:"), "quiz heading must be excluded");
    assert.ok(!text.includes("What holds thread below?"), "quiz question must be excluded");
    assert.ok(!text.includes("✓"), "answer markers must be excluded");
  });

  it("replacing an old managed block removes its quiz section", () => {
    const legacyBlock = [
      MANAGED_START,
      "Learn stitching basics.",
      "Quick quiz:",
      "1. What holds thread below?",
      "   a) Bobbin ✓",
      MANAGED_END,
    ].join("\n\n");
    const { description, replaced } = mergeOutlineIntoDescription(legacyBlock, OUTLINE_A, DRAFT_A);
    assert.equal(replaced, true);
    assert.ok(!description.includes("Quick quiz:"));
    assert.ok(!description.includes("✓"));
    assert.ok(!description.includes("What holds thread below?"));
    assert.ok(description.includes("Lesson plan:"));
  });
});

describe("mergeOutlineIntoDescription", () => {
  it("1. preserves manual text before and after managed sections", () => {
    const existing = "Manual intro written by admin.";
    const { description, replaced } = mergeOutlineIntoDescription(existing, OUTLINE_A, DRAFT_A);
    assert.equal(replaced, false);
    assert.ok(description.startsWith(existing));
    assert.ok(description.includes(MANAGED_START));
    assert.ok(description.includes("Know your machine"));
  });

  it("2. reapplying the same outline is idempotent", () => {
    const first = mergeOutlineIntoDescription("Manual intro.", OUTLINE_A, DRAFT_A);
    const second = mergeOutlineIntoDescription(first.description, OUTLINE_A, DRAFT_A);
    assert.equal(second.replaced, true);
    assert.equal(second.description, first.description);
  });

  it("3. a different outline replaces managed sections without duplication", () => {
    const first = mergeOutlineIntoDescription(
      "Manual intro.",
      OUTLINE_A,
      DRAFT_A
    ).description;
    const draftB = { title: "B", descriptionEn: OUTLINE_B.descriptionEn, descriptionHi: OUTLINE_B.descriptionHi };
    const second = mergeOutlineIntoDescription(first, OUTLINE_B, draftB);
    assert.equal(second.replaced, true);
    assert.ok(!second.description.includes("Know your machine"));
    assert.ok(second.description.includes("Cutting cloth"));
    assert.ok(second.description.startsWith("Manual intro."));
    assert.equal(second.description.split(MANAGED_START).length - 1, 1);
  });

  it("4. descriptions with no managed sections get the block appended", () => {
    const { description, replaced } = mergeOutlineIntoDescription(
      "Just a plain description.",
      OUTLINE_A,
      DRAFT_A
    );
    assert.equal(replaced, false);
    assert.ok(description.startsWith("Just a plain description."));
    assert.ok(description.includes(MANAGED_END));
  });

  it("5. empty and missing descriptions are handled", () => {
    for (const existing of ["", "   ", null, undefined, 42]) {
      const { description } = mergeOutlineIntoDescription(existing, OUTLINE_A, DRAFT_A);
      assert.ok(description.includes(MANAGED_START), `failed for ${JSON.stringify(existing)}`);
    }
    const emptyOutline = mergeOutlineIntoDescription("Keep me.", { lessons: [] }, {});
    assert.equal(emptyOutline.description, "Keep me.");
    assert.equal(emptyOutline.replaced, false);
  });

  it("6. legacy labels as ordinary prose are never deleted", () => {
    const legacy =
      "My Lesson plan: is flexible. Learning objectives: are personal. Quick quiz: ask me anything.";
    const { description, replaced } = mergeOutlineIntoDescription(legacy, OUTLINE_A, DRAFT_A);
    assert.equal(replaced, false);
    assert.ok(description.startsWith(legacy));
  });

  it("7. English and Hindi descriptions are labeled and preserved", () => {
    const { description } = mergeOutlineIntoDescription("", OUTLINE_A, DRAFT_A);
    assert.ok(description.includes("Learn stitching basics."));
    assert.ok(description.includes("--- हिन्दी विवरण ---"));
    assert.ok(description.includes("सिलाई की बुनियाद सीखें।"));
  });

  it("8. label-like prose plus a real managed block merges safely", () => {
    const withBlock = mergeOutlineIntoDescription(
      "Note: my Lesson plan: stays flexible.",
      OUTLINE_A,
      DRAFT_A
    ).description;
    const draftB = { title: "B", descriptionEn: "New EN.", descriptionHi: "नया।" };
    const second = mergeOutlineIntoDescription(withBlock, OUTLINE_B, draftB);
    assert.ok(second.description.startsWith("Note: my Lesson plan: stays flexible."));
    assert.ok(!second.description.includes("Know your machine"));
    assert.ok(second.description.includes("Cutting cloth"));
  });

  it("dangling start marker replaces to end of text", () => {
    const broken = `Manual intro.\n\n${MANAGED_START}\nStale fragment`;
    const { description, replaced } = mergeOutlineIntoDescription(broken, OUTLINE_A, DRAFT_A);
    assert.equal(replaced, true);
    assert.ok(!description.includes("Stale fragment"));
    assert.ok(description.startsWith("Manual intro."));
    assert.ok(description.includes(MANAGED_END));
  });

  it("managed block round-trips through buildManagedBlock", () => {
    const block = buildManagedBlock(OUTLINE_A, DRAFT_A);
    assert.ok(block.startsWith(MANAGED_START));
    assert.ok(block.endsWith(MANAGED_END));
  });
});
