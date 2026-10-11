// Pure parser for Course.description rendering on course detail pages.
// Handles the canonical builder format (blank-line separated sections with
// headings and one item per line) AND flattened legacy content where
// newlines were lost (headings mid-line, hyphen-joined items, several
// numbered lessons on one line, inline markers).
//
// Safety rules:
// - Markers (MANAGED_START/END) are internal delimiters: stripped wherever
//   they appear as exact substrings, never rendered.
// - Inline recovery is conservative: a mid-line heading phrase only splits
//   the line when the text after it shows list evidence (a bullet/numbered
//   start, or " - " joining real segments). Otherwise the line stays prose,
//   so sentences like "My Lesson plan: is flexible" are never shredded.
// - Hyphen splitting applies only inside active objectives/takeaways lists
//   or right after their heading; ordinary prose hyphens are untouched.
// - "Quick quiz:" sections are recognized only so they can be SKIPPED;
//   quiz content is never rendered (it must not live in descriptions).
// - No HTML is generated here; the React component renders text nodes only.

const HEADINGS = {
  objectives: ["learning objectives:"],
  plan: ["lesson plan:"],
  takeaways: ["key takeaways:"],
  quiz: ["quick quiz:"],
};

export const HINDI_SEPARATOR = "--- हिन्दी विवरण ---";
const BULLET_START_RE = /^[-*•]\s+/;
const ORDERED_START_RE = /^\d+[.)]\s+/;
const HYPHEN_SPLIT_RE = /\s+-\s+/;

function headingKindOf(text) {
  const normalized = text.trim().toLowerCase();
  for (const [kind, variants] of Object.entries(HEADINGS)) {
    if (variants.includes(normalized)) return kind;
  }
  return null;
}

function listEvidenceAfter(kind, rest) {
  const text = rest.trim();
  if (!text) return kind === "quiz" ? false : false;
  if (kind === "plan") return /^\d+[.)]\s+\S/.test(text) || /\s\d+[.)]\s+\S/.test(text);
  if (kind === "quiz") {
    return /^\d+[.)]\s+\S/.test(text) || /\s\d+[.)]\s+\S/.test(text) || /^[a-z][)]\s+\S/i.test(text);
  }
  return BULLET_START_RE.test(text) || HYPHEN_SPLIT_RE.test(text);
}

// Splits "1. First — x. 2. Second — y." into items when numbering is
// sequential (starting at 1 or continuing the active list). Otherwise the
// line is left intact so decimals like "1.5 hours" never split.
function splitNumberedItems(text, startOrder) {
  const matches = [...text.matchAll(/(?:^|\s)(\d+)[.)]\s+/g)];
  if (matches.length < 2) return null;
  const nums = matches.map((m) => Number(m[1]));
  const firstExpected = startOrder > 1 ? startOrder : 1;
  const sequential = nums.every((n, i) => n === firstExpected + i);
  if (!sequential || nums[0] !== firstExpected) return null;
  const indices = matches.map((m) => m.index + (m[0].startsWith(" ") ? 1 : 0));
  const parts = indices.map((at, i) =>
    text.slice(at, indices[i + 1]).replace(/^\d+[.)]\s+/, "").trim()
  );
  if (parts.some((p) => !p)) return null;
  return parts;
}

// Splits one raw line into parseable chunks, recovering structure that
// survived newline loss. Returns chunks in order.
function expandLine(line, markers) {
  let chunks = [line];
  for (const marker of markers) {
    if (!marker) continue;
    chunks = chunks.flatMap((chunk) => chunk.split(marker).join("\n").split("\n"));
  }
  chunks = chunks.flatMap((chunk) => chunk.split(HINDI_SEPARATOR).join(`\n${HINDI_SEPARATOR}\n`).split("\n"));

  const out = [];
  for (const chunk of chunks) {
    let rest = chunk;
    // Each pass consumes one heading, so rest strictly shrinks and the
    // loop always terminates; the guard is only a backstop.
    let guard = 0;
    while (guard++ < 50) {
      const lowered = rest.toLowerCase();
      let found = null;
      for (const variants of Object.values(HEADINGS)) {
        for (const phrase of variants) {
          const at = lowered.indexOf(phrase);
          if (at !== -1 && (found === null || at < found.at)) {
            found = { phrase, at };
          }
        }
      }
      if (!found) break;
      const before = rest.slice(0, found.at);
      const after = rest.slice(found.at + found.phrase.length);
      if (before.trim()) {
        out.push(before);
        rest = rest.slice(found.at);
        continue;
      }
      // Heading at chunk start: split only with list evidence (or if the
      // chunk is exactly the heading).
      if (!after.trim() || listEvidenceAfter(headingKindOf(found.phrase) || "objectives", after)) {
        out.push(rest.slice(found.at, found.at + found.phrase.length));
        rest = after;
        if (!rest.trim()) {
          rest = "";
          break;
        }
        continue;
      }
      break;
    }
    if (rest && rest.trim()) out.push(rest);
    else if (rest && !rest.trim() && out.length === 0) out.push(rest);
  }
  // Preserve blank-line separation: an input line that yields no chunks
  // still emits one empty chunk so the main loop flushes open blocks.
  return out.length > 0 ? out.filter((c, i) => c.trim() || i === 0) : [""];
}

// Derives a clean one-snippet card preview from a description without
// modifying the saved text. Returns the first substantial English (or
// preferred-language) intro paragraph: no markers, no Hindi section on
// English cards, no objectives/plan/takeaways/quiz sections. A leading
// stub line (e.g. a bare "Stitching Course" title prefix) is skipped when
// more intro text follows. Returns "" when there is nothing usable.
export function getDescriptionPreview(description, options = {}) {
  const { lang = "en", markers = [] } = options;
  if (typeof description !== "string" || !description.trim()) return "";
  const paras = parseDescription(description, markers).filter(
    (block) => block.kind === "paragraph" && block.text.trim()
  );
  const pick = (wanted) => {
    const list = paras.filter((p) => p.lang === wanted);
    for (let i = 0; i < list.length; i++) {
      if (list[i].text.trim().length >= 30 || i === list.length - 1) {
        return list[i].text;
      }
    }
    return "";
  };
  return (pick(lang) || pick("en") || pick("hi") || "").replace(/\s+/g, " ").trim();
}

// Returns an array of blocks:
// { kind: "paragraph", text, lang: "en"|"hi" }
// { kind: "objectives"|"plan"|"takeaways", items: [string], lang: "en"|"hi" }
export function parseDescription(description, markers = []) {
  if (typeof description !== "string" || !description.trim()) return [];

  const blocks = [];
  let paragraph = [];
  let lang = "en";
  let list = null; // { kind, items, lang }
  let skippingQuiz = false;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join("\n"), lang });
      paragraph = [];
    }
  }

  function flushList() {
    if (list && list.items.length > 0) {
      blocks.push(list);
    }
    list = null;
  }

  function pushItems(kind, parts) {
    if (!list || list.kind !== kind) {
      flushParagraph();
      flushList();
      list = { kind, items: [], lang };
    }
    for (const part of parts) {
      const clean = part.trim();
      if (clean) list.items.push(clean);
    }
  }

  for (const rawLine of description.split("\n")) {
    for (const chunk of expandLine(rawLine, markers)) {
      const trimmed = chunk.trim();
      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      if (trimmed === HINDI_SEPARATOR) {
        flushParagraph();
        flushList();
        skippingQuiz = false;
        lang = "hi";
        continue;
      }

      const kind = headingKindOf(trimmed);
      if (kind) {
        flushParagraph();
        flushList();
        skippingQuiz = kind === "quiz";
        lang = "en";
        if (kind !== "quiz") {
          list = { kind, items: [], lang };
        }
        continue;
      }

      if (skippingQuiz) continue;

      const bulletMatch = BULLET_START_RE.test(trimmed);
      const orderedMatch = ORDERED_START_RE.test(trimmed);
      const activeList = list && (list.kind === "objectives" || list.kind === "takeaways" || list.kind === "plan");

      if (activeList && list.kind === "plan" && (orderedMatch || /\d+[.)]\s+\S/.test(trimmed))) {
        const parts = orderedMatch
          ? splitNumberedItems(trimmed, list.items.length + 1) || [trimmed.replace(ORDERED_START_RE, "")]
          : splitNumberedItems(trimmed, list.items.length + 1);
        if (parts) {
          pushItems("plan", parts);
          continue;
        }
        flushList();
      } else if (activeList && (list.kind === "objectives" || list.kind === "takeaways") && (bulletMatch || HYPHEN_SPLIT_RE.test(trimmed))) {
        const stripped = trimmed.replace(BULLET_START_RE, "");
        const parts = stripped.split(HYPHEN_SPLIT_RE).map((p) => p.trim()).filter(Boolean);
        if (parts.length > 1 || bulletMatch) {
          pushItems(list.kind, parts.length > 1 ? parts : [stripped]);
          continue;
        }
        flushList();
      } else if (activeList) {
        flushList();
      }

      paragraph.push(trimmed);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}
