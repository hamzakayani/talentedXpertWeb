import { noIndexMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = noIndexMetadata;

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
