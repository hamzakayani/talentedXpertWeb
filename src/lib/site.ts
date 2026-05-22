/** Canonical production site URL (www). Used for metadata, sitemap, and redirects. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.DOMAIN_WWW ??
  process.env.DOMAIN ??
  "https://www.talentedxpert.com";

export const SITE_HOST = new URL(SITE_URL).host;

/** Public marketing pages included in sitemap.xml */
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/contactus",
  "/FAQs",
  "/privacyPolicy",
  "/termsConditions",
  "/delete-account-policies",
  "/dispute-policies",
  "/projects",
  "/readMore",
  "/tasks",
  "/signin",
  "/register",
] as const;
