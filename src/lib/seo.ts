import type { Metadata } from "next";

type PageSeoConfig = {
  title: string;
  description: string;
  /** Skip the root layout title template (e.g. homepage). */
  absoluteTitle?: boolean;
};

const PAGE_SEO: Record<string, PageSeoConfig> = {
  "/": {
    title: "TalentedXpert | Connect with Skilled Experts",
    description:
      "Find talented experts, post projects, and manage work on TalentedXpert. Hire skilled professionals or offer your expertise today.",
    absoluteTitle: true,
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about TalentedXpert, our mission, and how we connect skilled experts with clients for successful projects.",
  },
  "/blog": {
    title: "Blog",
    description:
      "Read the latest insights, tips, and updates from the TalentedXpert team.",
  },
  "/contactus": {
    title: "Contact Us",
    description:
      "Get in touch with the TalentedXpert team for support, partnerships, or general inquiries.",
  },
  "/FAQs": {
    title: "FAQs",
    description:
      "Find answers to frequently asked questions about using TalentedXpert, accounts, payments, and more.",
  },
  "/privacyPolicy": {
    title: "Privacy Policy",
    description:
      "Read TalentedXpert's privacy policy to understand how we collect, use, and protect your personal information.",
  },
  "/termsConditions": {
    title: "Terms and Conditions",
    description:
      "Review the terms and conditions for using the TalentedXpert platform and services.",
  },
  "/delete-account-policies": {
    title: "Delete Account Policies",
    description:
      "Learn how to delete your TalentedXpert account and what happens to your data.",
  },
  "/dispute-policies": {
    title: "Dispute Policies",
    description:
      "Understand TalentedXpert's dispute resolution policies and how conflicts are handled on the platform.",
  },
  "/projects": {
    title: "Projects",
    description:
      "Explore and manage projects on TalentedXpert. Connect with experts to bring your ideas to life.",
  },
  "/readMore": {
    title: "Learn More",
    description:
      "Discover more about TalentedXpert and how our platform helps clients and experts succeed together.",
  },
  "/tasks": {
    title: "Browse Tasks",
    description:
      "Browse available tasks on TalentedXpert and find opportunities that match your skills and expertise.",
  },
  "/signin": {
    title: "Sign In",
    description:
      "Sign in to your TalentedXpert account to manage tasks, proposals, messages, and profile settings.",
  },
  "/register": {
    title: "Register",
    description:
      "Create your TalentedXpert account to hire skilled experts or offer your professional services.",
  },
};

const USER_TYPE_SEO: Record<string, PageSeoConfig> = {
  "talent-requestors": {
    title: "Talent Requestors",
    description:
      "Browse talent requestors on TalentedXpert looking for skilled experts to complete their projects.",
  },
  "talented-xperts": {
    title: "TalentedXperts",
    description:
      "Discover skilled TalentedXperts on TalentedXpert ready to help with your projects and tasks.",
  },
};

/** Prevent indexing of authenticated or utility routes. */
export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function normalizePath(path: string): string {
  return path === "/" || path.startsWith("/") ? path : `/${path}`;
}

function buildMetadata(path: string, config: PageSeoConfig): Metadata {
  const canonical = normalizePath(path);
  const { title, description, absoluteTitle } = config;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      title,
      description,
    },
  };
}

/** Metadata for static public pages (title, description, canonical, OG). */
export function pageMetadata(path: string): Metadata {
  const config = PAGE_SEO[normalizePath(path)];
  if (!config) {
    return canonicalOnlyMetadata(path);
  }
  return buildMetadata(path, config);
}

/** Metadata for dynamic pages with explicit title and description. */
export function pageMetadataWith(
  path: string,
  config: PageSeoConfig,
): Metadata {
  return buildMetadata(path, config);
}

/** Per-page canonical URL only (path resolved against metadataBase). */
export function canonicalMetadata(path: string): Metadata {
  return pageMetadata(path);
}

/** Build canonical metadata from URL path segments. */
export function canonicalFromSegments(...segments: string[]): Metadata {
  return pageMetadata(`/${segments.filter(Boolean).join("/")}`);
}

function canonicalOnlyMetadata(path: string): Metadata {
  const canonical = normalizePath(path);
  return {
    alternates: { canonical },
  };
}

export function userTypeListingMetadata(userType: string): Metadata {
  const config = USER_TYPE_SEO[userType] ?? {
    title: "Browse Profiles",
    description:
      "Browse profiles on TalentedXpert and connect with the right people for your project.",
  };
  return buildMetadata(`/${userType}`, config);
}

export function userProfileMetadata(userType: string, id: string): Metadata {
  const typeLabel = USER_TYPE_SEO[userType]?.title ?? "Profile";
  return buildMetadata(`/${userType}/${id}`, {
    title: `${typeLabel} Profile`,
    description: `View skills, reviews, and completed work for this ${typeLabel.toLowerCase()} on TalentedXpert.`,
  });
}

export function userReviewsMetadata(userType: string, id: string): Metadata {
  return buildMetadata(`/${userType}/${id}/allReviews`, {
    title: "Reviews",
    description:
      "Read reviews and ratings for this TalentedXpert profile.",
  });
}

export function completedTasksMetadata(userType: string, id: string): Metadata {
  return buildMetadata(`/${userType}/${id}/completedTasks`, {
    title: "Completed Tasks",
    description:
      "View completed tasks and project history for this TalentedXpert profile.",
  });
}

export function taskDetailMetadata(id: string): Metadata {
  return buildMetadata(`/tasks/${id}`, {
    title: "Task Details",
    description:
      "View task details, requirements, and proposals on TalentedXpert.",
  });
}
