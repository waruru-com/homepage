import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

const siteUrl = process.env.SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://127.0.0.1:3000"),
  ),
  title: "와루루 Waruru | 오늘의 우연이, 내일의 우리가 되는 곳",
  description:
    "가까운 곳에서 시작되는 새로운 만남. 대화 카드부터 마음을 전하는 롤링페이퍼까지, 와루루의 첫 소식을 받아보세요.",
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Waruru 와루루",
    title: "오늘의 우연이, 내일의 우리가 되는 곳",
    description: "우리의 첫 만남, 와루루. 사전등록하고 출시 소식을 받아보세요.",
    images: [
      {
        url: "/images/river-welcome.webp",
        width: 1024,
        height: 1536,
        alt: "한강의 노을을 함께 바라보는 두 사람",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: siteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          본문으로 바로가기
        </a>
        {children}
      </body>
    </html>
  );
}
