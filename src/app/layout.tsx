import type { Metadata } from "next";
import { Noto_Serif, Roboto } from "next/font/google";
import "./globals.css";

import BackgroundMusic from "@/components/BackgroundMusic";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-roboto",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "StoryTeller",
  description: "Biên niên sử Hồ Chí Minh - Truyện kể về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} ${notoSerif.variable} antialiased`}>
        {children}
        <BackgroundMusic />
      </body>
    </html>
  );
}
