import { canonicalMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = canonicalMetadata("/FAQs");

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
