import type { Metadata } from "next";

/** Prevent indexing of authenticated or utility routes. */
export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/** Per-page canonical URL (path only; resolved against metadataBase). */
export function canonicalMetadata(path: string): Metadata {
  return {
    alternates: {
      canonical: path,
    },
  };
}
