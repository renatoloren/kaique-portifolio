"use client";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"], // Definindo o subset da fonte
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexendDeca.className}>{children}</body>
    </html>
  );
}
