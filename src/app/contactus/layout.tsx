import { canonicalMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = canonicalMetadata("/contactus");

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
