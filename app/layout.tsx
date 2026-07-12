import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Концепт лендинга для компании по строительству современных бань",
  description:
    "Портфолио-концепт коммерческого лендинга: современная банная архитектура, проектные кейсы, комплектации и интерактивный калькулятор.",
  openGraph: {
    title: "Концепт лендинга — современные бани",
    description: "Демонстрационный дизайн и интерактивный прототип для портфолио.",
    type: "website",
    images: [{ url: `${basePath}/images/hero-bathhouse.webp`, width: 1600, height: 900, alt: "Современная баня в сосновом лесу" }],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
