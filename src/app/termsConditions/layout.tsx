import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/termsConditions");

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
