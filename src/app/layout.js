import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "@/components/LayoutClient"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "سوق الملخصات الجامعية",
  description:
    "منصة لبيع وشراء الملخصات الجامعية بين الطلاب، وفر وقتك واستفد من خبرات زملائك",
  keywords: [
    "ملخصات",
    "جامعة",
    "طلاب",
    "مذاكرة",
    "بيع",
    "شراء",
    "ملخصات جامعية",
  ],
  authors: [{ name: "A+" }],
  creator: "A+ Team",
  openGraph: {
    title: "سوق الملخصات الجامعية",
    description: "اشترِ أو بع ملخصاتك الجامعية بسهولة وأمان عبر منصة A+",
    url: "https://aplusplatformsa.com",
    siteName: "سوق الملخصات الجامعية",
    locale: "ar_EG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "سوق الملخصات الجامعية",
    description: "منصة تبادل ملخصات دراسية بين طلاب الجامعات.",
    creator: "@your_handle",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
