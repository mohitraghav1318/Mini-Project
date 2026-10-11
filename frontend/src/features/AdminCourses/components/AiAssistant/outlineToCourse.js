// Pure helper: flattens a generated AI outline into the single course
// description field (the only free-text field on Course). Every section is
// rebuilt from the current draft + outline on each Apply, so applying twice
// replaces rather than duplicates content. The result stays editable in the
// normal course form and is persisted by the normal course submission.
//
// Quiz questions are intentionally excluded: they are shown in the AI
// assistant preview but must never be stored in Course.description.
// Replacing an old managed block therefore also removes its quiz section.
//
// Why not Lesson rows? Lesson requires a YouTube URL/videoId (NOT NULL +
// player embed), which generation cannot provide. Creating videoless lessons
// would break validation and playback, so lesson titles/summaries travel
// inside the description until an admin attaches real videos.

function asLines(value) {
  return (Array.isArray(value) ? value : [])
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());
}

export function buildCourseDescription(outline, draft) {
  return buildOutlineSections(outline, draft).join("\n\n");
}

// Explicit boundaries marking AI-managed text inside an edited description.
// Only text between these markers is ever replaced; everything else —
// including legacy prose that merely resembles a section label — is kept.
export const MANAGED_START = "----- AI course outline (generated, editable) -----";
export const MANAGED_END = "----- End of AI course outline -----";

export function buildManagedBlock(outline, draft) {
  const sections = buildOutlineSections(outline, draft);
  if (sections.length === 0) return "";
  return [MANAGED_START, ...sections, MANAGED_END].join("\n\n");
}

// Merges a generated outline into an existing description without touching
// unrelated manual text. Returns { description, replaced } where replaced
// is true when a previous managed block was found and swapped.
// Safety rules:
// - No markers present -> append the new block, never delete anything.
//   Legacy/ambiguous text is therefore never rewritten.
// - Start marker without an end marker -> replace from the marker to the
//   end of the text (the fragment after it could only be AI-managed).
// - Empty new block + existing block -> remove the old block.
// - Reapplying the same outline rebuilds the identical block (idempotent).
export function mergeOutlineIntoDescription(existing, outline, draft) {
  const current = typeof existing === "string" ? existing : "";
  const block = buildManagedBlock(outline, draft);
  const tidy = (value) => value.replace(/\n{3,}/g, "\n\n").trim();

  const startAt = current.indexOf(MANAGED_START);
  if (startAt === -1) {
    if (!block) return { description: current, replaced: false };
    const prefix = current.trim();
    return {
      description: prefix ? tidy(`${prefix}\n\n${block}`) : block,
      replaced: false,
    };
  }

  const endAt = current.indexOf(MANAGED_END, startAt);
  const before = current.slice(0, startAt);
  const after = endAt === -1 ? "" : current.slice(endAt + MANAGED_END.length);
  if (!block) {
    return { description: tidy(`${before}\n\n${after}`), replaced: true };
  }
  return { description: tidy(`${before}\n\n${block}\n\n${after}`), replaced: true };
}

function buildOutlineSections(outline, draft) {
  const source = draft || outline || {};
  const descriptionEn = (source.descriptionEn || "").trim();
  const descriptionHi = (source.descriptionHi || "").trim();
  const sections = [];

  if (descriptionEn) {
    sections.push(descriptionEn);
  }
  if (descriptionHi) {
    sections.push(`--- हिन्दी विवरण ---\n${descriptionHi}`);
  }

  const objectives = asLines(outline?.objectives);
  if (objectives.length > 0) {
    sections.push(`Learning objectives:\n${objectives.map((item) => `- ${item}`).join("\n")}`);
  }

  const lessons = (Array.isArray(outline?.lessons) ? outline.lessons : [])
    .filter((lesson) => lesson && typeof lesson.title === "string" && lesson.title.trim())
    .map((lesson, index) => {
      const order = Number.isInteger(lesson.order) ? lesson.order : index + 1;
      const summary =
        typeof lesson.summary === "string" && lesson.summary.trim()
          ? ` — ${lesson.summary.trim()}`
          : "";
      return `${order}. ${lesson.title.trim()}${summary}`;
    });
  if (lessons.length > 0) {
    sections.push(`Lesson plan:\n${lessons.join("\n")}`);
  }

  const takeaways = asLines(outline?.takeaways);
  if (takeaways.length > 0) {
    sections.push(`Key takeaways:\n${takeaways.map((item) => `- ${item}`).join("\n")}`);
  }

  return sections;
}
