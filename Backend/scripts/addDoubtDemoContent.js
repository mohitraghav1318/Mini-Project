import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// One-off demo setup for the AI doubt bot presentation.
// Writes MANUALLY SUPPLIED lesson notes (not video transcripts — the bot
// never claims to have watched any video) to the Stitching course lessons
// so the bot has real grounded material to answer from.
// Usage: node scripts/addDoubtDemoContent.js [courseId]
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_NOTES_BY_ORDER = {
  1: `Lesson 1 notes - Sewing machine basics (manually supplied):
- Parts of a hand sewing machine: needle, presser foot, bobbin, thread spool pin, hand wheel, stitch plate.
- Steps to start: place the machine on a stable table, turn the hand wheel towards you to check the needle moves freely.
- Threading: put the thread spool on the spool pin, pass thread through the guides, then through the needle eye from front to back.
- Winding the bobbin: wrap thread around the bobbin, place it on the bobbin winder, press the pedal slowly until full.
- Practice straight stitching on an old cloth strip first. Keep speed slow and hands away from the needle.
- Common mistake: loose stitches usually mean the thread tension dial is too loose or threading missed a guide. Rethread fully.
- Safety: never touch the needle while the wheel is turning. Switch off or stop pedalling before adjusting cloth.
Hindi: सिलाई मशीन के मुख्य भाग - सुई, प्रेसर फुट, बॉबिन, धागे की रील। सीधी सिलाई का अभ्यास पहले पुराने कपड़े पर करें। ढीले टांके का मतलब है धागा सही से नहीं पिरोया गया है।`,
  2: `Lesson 2 notes - Measuring and cutting cloth (manually supplied):
- Tools needed: measuring tape, tailor chalk, sharp scissors, scale.
- Take body measurements: chest (छाती), waist (कमर), shoulder (कंधा), sleeve length (आस्तीन की लंबाई). Write them in a notebook.
- For a simple blouse: add 2 inch extra (seam allowance) to every measurement before cutting.
- Mark the cloth with tailor chalk on the wrong side of the fabric. Cut slowly along the marked lines.
- Always cut straight grain (along the length of the cloth) so the garment does not twist after washing.
- Common mistake: cutting without seam allowance makes the garment too tight. Beginners should add 2 inches.
- Press cut pieces with an iron before stitching for neat seams.
Hindi: नाप लेते समय 2 इंच सिलाई का मार्जिन जरूर जोड़ें। गलत नाप से कपड़ा टाइट बनता है।`,
  3: `Lesson 3 notes - Stitching a simple blouse and finishing (manually supplied):
- Steps: join shoulder seams first, then attach sleeves, then stitch side seams from sleeve to bottom.
- Keep seam lines straight by following the stitch plate guide lines on the machine.
- Neckline finishing: fold the edge twice (about 0.5 cm each fold) and stitch, or attach piping for a neat look.
- Hemming: fold the bottom edge twice and stitch slowly around the full circle.
- Try the blouse on the customer or check against measurements before final pressing.
- Common mistake: uneven sleeves happen when shoulder seams are not matched. Pin both sides before stitching.
- Pricing tip for beginners: charge for cloth plus stitching labour separately, and note all orders in a diary.
Hindi: कंधे की सिलाई पहले करें, फिर आस्तीन लगाएं। गले की पट्टी दो बार मोड़कर सिलें।`,
};

async function main() {
  const courseId = Number(process.argv[2]) || 6;
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
  if (lessons.length === 0) {
    console.error(`No lessons found for course ${courseId}.`);
    process.exit(1);
  }
  for (const lesson of lessons) {
    const notes = DEMO_NOTES_BY_ORDER[lesson.order];
    if (!notes) continue;
    await prisma.lesson.update({ where: { id: lesson.id }, data: { content: notes } });
    console.log(`Updated lesson ${lesson.id} (order ${lesson.order}): ${lesson.title}`);
  }
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error("Error seeding demo content:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
