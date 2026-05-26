const DEFAULT_SITE_URL = "https://printmedesign.com";

function normalizeSiteUrl(value?: string) {
  const url = value?.trim() || DEFAULT_SITE_URL;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function parseList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseStorageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "print-files",
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  sendGridFromEmail: process.env.SENDGRID_FROM_EMAIL,
  sendGridAdminEmail: process.env.SENDGRID_ADMIN_EMAIL,
  sendGridReplyToEmail: process.env.SENDGRID_REPLY_TO_EMAIL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  adminPortalEnabled: process.env.ADMIN_PORTAL_ENABLED === "true",
  adminUserEmails: parseList(process.env.ADMIN_USER_EMAILS),
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
};

export function isProduction() {
  return env.nodeEnv === "production";
}

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isSupabaseServerConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isStripeConfigured() {
  return Boolean(env.stripeSecretKey);
}

export function isSendGridConfigured() {
  return Boolean(env.sendGridApiKey && env.sendGridFromEmail && env.sendGridAdminEmail);
}

export function isStripeWebhookConfigured() {
  return Boolean(env.stripeSecretKey && env.stripeWebhookSecret);
}

export function getBackendReadinessSummary() {
  return {
    supabaseBrowserConfigured: isSupabaseConfigured(),
    supabaseServerConfigured: isSupabaseServerConfigured(),
    storageBucket: env.supabaseStorageBucket,
    stripeConfigured: isStripeConfigured(),
    stripeWebhookConfigured: isStripeWebhookConfigured(),
    emailConfigured: isSendGridConfigured(),
    adminPortalEnabled: env.adminPortalEnabled,
  };
}
