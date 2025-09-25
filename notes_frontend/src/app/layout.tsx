import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes App - Ocean Professional",
  description: "A modern note-taking application with Ocean Professional styling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
