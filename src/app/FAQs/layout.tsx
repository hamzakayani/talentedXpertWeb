import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/FAQs");

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
