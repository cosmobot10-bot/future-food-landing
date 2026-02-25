import { readFile, rm } from "node:fs/promises";

import { afterEach, describe, expect, it } from "vitest";

import { __internal, persistLaunchMissionTelemetry } from "@/lib/telemetry-store";

afterEach(async () => {
  await rm(__internal.DEV_FALLBACK_PATH, { force: true });
});

describe("persistLaunchMissionTelemetry", () => {
  it("falls back to local jsonl when supabase env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const result = await persistLaunchMissionTelemetry({
      timestamp: new Date().toISOString(),
      ip: "1.1.1.1",
      userAgent: "ua",
      acceptLanguage: "en",
      referer: "",
      method: "POST",
      path: "/api/telemetry/launch-mission",
      queryParams: { source: "hero" },
      cookies: { session_id: "abc" },
    });

    expect(result.mode).toBe("jsonl");

    const fileData = await readFile(__internal.DEV_FALLBACK_PATH, "utf8");
    expect(fileData).toContain('"path":"/api/telemetry/launch-mission"');
  });
});
