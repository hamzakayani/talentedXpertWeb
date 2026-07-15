import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/blog");

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
