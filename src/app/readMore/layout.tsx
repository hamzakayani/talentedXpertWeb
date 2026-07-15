import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/readMore");

export default function ReadMoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
