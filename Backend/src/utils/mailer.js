import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Rural Women Helper" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
}