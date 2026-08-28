import { Mukta, Rozha_One } from "next/font/google";
import "./globals.scss";

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const rozhaOne = Rozha_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata = {
  title: "Rural Women Helper",
  description:
    "Learn skills, connect with your community, find help — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${mukta.variable} ${rozhaOne.variable}`}>
        {children}
      </body>
    </html>
  );
}