export type LaunchMissionTelemetry = {
  timestamp: string;
  ip: string;
  userAgent: string;
  acceptLanguage: string;
  referer: string;
  method: string;
  path: string;
  queryParams: Record<string, string>;
  cookies: Record<string, string>;
};

const MAX_HEADER_LEN = 512;
const MAX_QUERY_KEYS = 20;
const MAX_QUERY_KEY_LEN = 64;
const MAX_QUERY_VALUE_LEN = 200;
const MAX_COOKIE_KEYS = 12;
const MAX_COOKIE_KEY_LEN = 64;
const MAX_COOKIE_VALUE_LEN = 128;

const BLOCKED_COOKIE_KEY = /(auth|token|pass|secret|jwt|bearer|csrf)/i;
const ID_COOKIE_KEY = /(^|_)(id|sid)$|^(sid|sessionid|visitorid|userid|anonymousid|anonid)$/i;
const SAFE_COOKIE_VALUE = /^[a-zA-Z0-9._:-]{1,128}$/;

function sanitizeText(value: string | null, maxLen: number): string {
  if (!value) return "";
  return value.replace(/[\r\n\t\0]/g, " ").trim().slice(0, maxLen);
}

function getIp(req: Request): string {
  const xForwardedFor = sanitizeText(req.headers.get("x-forwarded-for"), 256);
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim().slice(0, 64) ?? "unknown";
  }

  const xRealIp = sanitizeText(req.headers.get("x-real-ip"), 64);
  if (xRealIp) return xRealIp;

  const fromForwarded = sanitizeText(req.headers.get("forwarded"), 256).match(/for=([^;\s,]+)/i)?.[1];
  if (fromForwarded) return fromForwarded.replace(/['"\[\]]/g, "").slice(0, 64);

  return "unknown";
}

function pickQueryParams(url: URL): Record<string, string> {
  const out: Record<string, string> = {};
  let count = 0;

  for (const [k, v] of url.searchParams.entries()) {
    if (count >= MAX_QUERY_KEYS) break;

    const key = sanitizeText(k, MAX_QUERY_KEY_LEN);
    const value = sanitizeText(v, MAX_QUERY_VALUE_LEN);
    if (!key) continue;

    out[key] = value;
    count += 1;
  }

  return out;
}

function parseCookieHeader(cookieHeader: string): Array<[string, string]> {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf("=");
      if (idx <= 0) return ["", ""] as [string, string];
      return [part.slice(0, idx).trim(), decodeURIComponent(part.slice(idx + 1).trim())] as [string, string];
    });
}

function pickCookies(cookieHeader: string): Record<string, string> {
  const out: Record<string, string> = {};
  let count = 0;

  for (const [rawKey, rawValue] of parseCookieHeader(cookieHeader)) {
    if (count >= MAX_COOKIE_KEYS) break;

    const key = sanitizeText(rawKey, MAX_COOKIE_KEY_LEN);
    if (!key || BLOCKED_COOKIE_KEY.test(key) || !ID_COOKIE_KEY.test(key)) continue;

    const value = sanitizeText(rawValue, MAX_COOKIE_VALUE_LEN);
    if (!value || !SAFE_COOKIE_VALUE.test(value)) continue;

    out[key] = value;
    count += 1;
  }

  return out;
}

export function extractLaunchMissionTelemetry(req: Request): LaunchMissionTelemetry {
  const url = new URL(req.url);

  return {
    timestamp: new Date().toISOString(),
    ip: getIp(req),
    userAgent: sanitizeText(req.headers.get("user-agent"), MAX_HEADER_LEN),
    acceptLanguage: sanitizeText(req.headers.get("accept-language"), MAX_HEADER_LEN),
    referer: sanitizeText(req.headers.get("referer"), MAX_HEADER_LEN),
    method: sanitizeText(req.method || "GET", 16).toUpperCase(),
    path: sanitizeText(url.pathname, 256),
    queryParams: pickQueryParams(url),
    cookies: pickCookies(req.headers.get("cookie") || ""),
  };
}
