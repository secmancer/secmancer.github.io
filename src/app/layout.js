import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Adan Silva (secmancer)",
  description: "Portfolio and personal site of Adan Silva (secmancer)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-dvh">
        <ThemeProvider attribute="class">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
