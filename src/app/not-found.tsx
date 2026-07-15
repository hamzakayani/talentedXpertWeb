import { noIndexMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = noIndexMetadata;

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-3">404</h1>
      <p className="mb-4">This page could not be found.</p>
      <Link href="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
