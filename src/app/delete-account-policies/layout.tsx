import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/delete-account-policies");

export default function DeleteAccountPoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
