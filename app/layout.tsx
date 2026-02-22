import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Тестовое задание для Frontend-разработчика"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
