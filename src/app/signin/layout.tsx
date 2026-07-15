import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/signin");

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
