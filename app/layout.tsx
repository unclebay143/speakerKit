import AuthProvider from "@/providers/SessionProvider";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SpeakerKit",
  description:
    "Manage Your Speaker Profile with Ease & Style, Create multiple bio versions, manage headshots, and share your speaker profile effortlessly. Perfect for conferences, events, and professional networking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
