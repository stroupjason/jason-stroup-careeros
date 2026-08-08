import { track, type BeforeSendEvent } from "@vercel/analytics/react";

const analyticsPreferenceKey = "careeros-analytics-preference-v1";
const campaignAttributionKey = "careeros-campaign-attribution-v1";
const analyticsPreferenceEvent = "careeros:analytics-preference";

const campaignParameters = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

const learningEventNames = new Set([
  "Learning Overview Viewed",
  "Learning Board Viewed",
  "Learning Board Filtered",
  "Learning Ticket Viewed",
  "Learning Timeline Viewed",
  "Learning Evidence Opened",
  "Current Learning Viewed",
  "Learning Course Opened",
]);
const learningPropertyAllowlist = new Set([
  "delivery",
  "evidence",
  "issueType",
  "initiative",
  "capability",
  "role",
  "provider",
  "course",
  "ctaLocation",
]);

type CampaignParameter = (typeof campaignParameters)[number];
type CampaignAttribution = Partial<Record<CampaignParameter, string>>;

type PortfolioEventMap = {
  "Project Opened": {
    project: string;
    location: "home" | "projects" | "role-lens" | "roadmap";
  };
  "Role Lens Opened": {
    role: string;
    location: "home" | "roles" | "project";
  };
  "Primary CTA Selected": {
    destination: "projects" | "roles" | "contact" | "live-project";
    location: "home-hero" | "home-contact" | "project-hero" | "role-hero";
  };
  "External Profile Opened": {
    profile: "github" | "linkedin" | "medium" | "published-writing";
    location: "footer" | "contact" | "writing";
  };
  "Learning Overview Viewed": Record<string, never>;
  "Learning Board Viewed": Record<string, never>;
  "Learning Board Filtered": {
    initiative?: string;
    delivery?: string;
    evidence?: string;
    capability?: string;
    role?: string;
    issueType?: string;
  };
  "Learning Ticket Viewed": {
    delivery: string;
    evidence: string;
    issueType: string;
    initiative: string;
  };
  "Learning Timeline Viewed": Record<string, never>;
  "Learning Evidence Opened": {
    evidence: string;
    initiative: string;
  };
  "Current Learning Viewed": {
    provider: string;
    course: string;
    evidence: string;
    delivery: string;
    initiative: string;
  };
  "Learning Course Opened": {
    provider: string;
    course: string;
    evidence: string;
    delivery: string;
    initiative: string;
    ctaLocation: "current-learning" | "completed-learning";
  };
};

function getStorage(name: "localStorage" | "sessionStorage") {
  try {
    const storage = window[name];
    const key = "__careeros_storage_test__";
    storage.setItem(key, key);
    storage.removeItem(key);
    return storage;
  } catch {
    return undefined;
  }
}

function normalizeCampaignValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function readCampaignAttribution(): CampaignAttribution {
  const storage = getStorage("sessionStorage");
  if (!storage) return {};

  try {
    return JSON.parse(
      storage.getItem(campaignAttributionKey) ?? "{}",
    ) as CampaignAttribution;
  } catch {
    return {};
  }
}

function analyticsProperties() {
  const attribution = readCampaignAttribution();
  return {
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
  };
}

export function captureCampaignAttribution(search = window.location.search) {
  const storage = getStorage("sessionStorage");
  if (!storage) return;

  const parameters = new URLSearchParams(search);
  const attribution = campaignParameters.reduce<CampaignAttribution>(
    (result, parameter) => {
      const value = parameters.get(parameter);
      const normalizedValue = value ? normalizeCampaignValue(value) : "";
      if (normalizedValue) result[parameter] = normalizedValue;
      return result;
    },
    {},
  );

  if (Object.keys(attribution).length > 0) {
    storage.setItem(
      campaignAttributionKey,
      JSON.stringify(attribution),
    );
  }
}

export function isAnalyticsEnabled() {
  const storage = getStorage("localStorage");
  if (!storage) {
    return navigator.doNotTrack !== "1";
  }

  const preference = storage.getItem(analyticsPreferenceKey);
  if (preference === "enabled") return true;
  if (preference === "disabled") return false;
  return navigator.doNotTrack !== "1";
}

export function setAnalyticsEnabled(enabled: boolean) {
  const storage = getStorage("localStorage");
  if (storage) {
    storage.setItem(
      analyticsPreferenceKey,
      enabled ? "enabled" : "disabled",
    );
  }
  window.dispatchEvent(new CustomEvent(analyticsPreferenceEvent));
}

export function subscribeToAnalyticsPreference(listener: () => void) {
  window.addEventListener(analyticsPreferenceEvent, listener);
  return () => window.removeEventListener(analyticsPreferenceEvent, listener);
}

export function filterAnalyticsEvent(event: BeforeSendEvent) {
  if (!isAnalyticsEnabled()) return null;

  try {
    const url = new URL(event.url);
    const allowedParameters = new URLSearchParams();

    campaignParameters.forEach((parameter) => {
      const value = url.searchParams.get(parameter);
      const normalizedValue = value ? normalizeCampaignValue(value) : "";
      if (normalizedValue) allowedParameters.set(parameter, normalizedValue);
    });

    url.search = allowedParameters.toString();
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}

export function sanitizeLearningAnalyticsProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) =>
      learningPropertyAllowlist.has(key)
      && typeof value === "string"
      && /^[a-z0-9 -]{1,64}$/i.test(value)),
  );
}

export function trackPortfolioEvent<EventName extends keyof PortfolioEventMap>(
  name: EventName,
  properties: PortfolioEventMap[EventName],
) {
  if (!isAnalyticsEnabled()) return;
  const eventProperties = learningEventNames.has(name)
    ? sanitizeLearningAnalyticsProperties(properties)
    : properties;
  try {
    track(name, { ...eventProperties, ...analyticsProperties() });
  } catch {
    // Analytics is observational and must never interrupt the portfolio experience.
  }
}
