import { canonicalMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = canonicalMetadata("/blog");

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
