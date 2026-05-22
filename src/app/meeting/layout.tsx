import { noIndexMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = noIndexMetadata;

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
