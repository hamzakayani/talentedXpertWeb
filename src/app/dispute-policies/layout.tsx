import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/dispute-policies");

export default function DisputePoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
