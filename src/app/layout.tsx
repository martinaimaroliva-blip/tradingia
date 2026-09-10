import type { ReactNode } from "react";
import "./globals.css";

// The real <html>/<body> shell lives in src/app/[locale]/layout.tsx so it can
// set `lang` and `dir` from the active locale. This root layout is a passthrough.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
