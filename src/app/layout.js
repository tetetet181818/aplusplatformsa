import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    description: "اشترِ أو بع ملخصاتك الجامعية بسهولة وأمان عبر منصة منصة A+",
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
    <html lang="en" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/public/favicon.ico" />
        <meta name="generator" content="Hostinger Horizons" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"true"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
