import { canonicalMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = canonicalMetadata("/tasks");

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
