import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import "./globalicon.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainstyle.scss";
import MainLayout from "@/components/MainLayout";
import QueryProvider from "@/components/providers/QueryProvider";
import { SITE_URL } from "@/lib/site";

// const inter = Inter({ subsets: ["latin"] });
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--figtreefont",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TalentedXpert",
    template: "%s | TalentedXpert",
  },
  description:
    "Connect with skilled experts and manage projects on TalentedXpert.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "TalentedXpert",
    title: "TalentedXpert",
    description:
      "Connect with skilled experts and manage projects on TalentedXpert.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.variable}>
        <QueryProvider>
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
