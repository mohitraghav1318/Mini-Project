import multer from "multer";
import mammoth from "mammoth";
import { PDFParse, PasswordException } from "pdf-parse";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";

export const MAX_NOTES_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_NOTES_CHARS = 5000; // matches Lesson.content doubt-bot budget

const ALLOWED_TYPES = {
  ".pdf": ["application/pdf"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".txt": ["text/plain"],
};

function fileExtension(name) {
  const dot = String(name || "").lastIndexOf(".");
  return dot >= 0 ? String(name).slice(dot).toLowerCase() : "";
}

const upload = multer({
  storage: multer.memoryStorage(), // never write uploads to disk
  limits: { fileSize: MAX_NOTES_FILE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = fileExtension(file.originalname);
    const allowed = ALLOWED_TYPES[ext];
    if (!allowed || !allowed.includes(file.mimetype)) {
      cb(new ApiError(400, "Unsupported file type. Upload a PDF, DOCX, or TXT file."));
      return;
    }
    cb(null, true);
  },
});

function parseUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          reject(new ApiError(400, "File is too large. Maximum size is 5 MB."));
          return;
        }
        reject(new ApiError(400, "File upload failed. Please try again."));
        return;
      }
      if (err) {
        reject(err instanceof ApiError ? err : new ApiError(400, "Invalid file."));
        return;
      }
      resolve();
    });
  });
}

async function extractPdf(buffer) {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return String(result?.text ?? "");
  } catch (err) {
    if (err instanceof PasswordException) {
      throw new ApiError(400, "This PDF is password-protected. Upload an unprotected file.");
    }
    throw new ApiError(400, "This PDF could not be read. It may be corrupt or image-only.");
  } finally {
    await parser.destroy().catch(() => {});
  }
}

async function extractDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return String(result?.value ?? "");
  } catch {
    throw new ApiError(400, "This DOCX file could not be read. It may be corrupt.");
  }
}

function normalizeText(text) {
  return String(text ?? "")
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Extracts lesson-notes text from an uploaded file for admin preview.
// Nothing is saved here; the admin reviews, edits, and saves via the
// existing lesson create/update endpoints (Lesson.content).
// Only file size and type are logged — never document contents.
export const extractLessonNotes = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId)) {
    throw new ApiError(404, "Course not found.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    throw new ApiError(404, "Course not found.");
  }

  await parseUpload(req, res);

  if (!req.file) {
    throw new ApiError(400, "A notes file is required. Upload a PDF, DOCX, or TXT file.");
  }

  const ext = fileExtension(req.file.originalname);
  console.info("[notes] extract request", {
    courseId,
    bytes: req.file.size,
    type: ext,
  });

  let raw;
  if (ext === ".pdf") {
    raw = await extractPdf(req.file.buffer);
  } else if (ext === ".docx") {
    raw = await extractDocx(req.file.buffer);
  } else {
    raw = req.file.buffer.toString("utf8");
  }

  const text = normalizeText(raw);

  if (!text) {
    throw new ApiError(400, "No readable text found in this file. Upload a document with text content.");
  }

  if (text.length > MAX_NOTES_CHARS) {
    throw new ApiError(
      400,
      `Extracted text is ${text.length} characters, which exceeds the ${MAX_NOTES_CHARS} character limit. Upload a shorter document.`
    );
  }

  return res.status(200).json({
    success: true,
    data: { text, charCount: text.length, fileType: ext },
  });
});
