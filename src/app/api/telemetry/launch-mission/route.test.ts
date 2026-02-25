import { readFile, rm } from "node:fs/promises";

import { afterEach, describe, expect, it } from "vitest";

import { __internal } from "@/lib/telemetry-store";
import { POST } from "./route";

afterEach(async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  await rm(__internal.DEV_FALLBACK_PATH, { force: true });
});

describe("POST /api/telemetry/launch-mission", () => {
  it("records telemetry and returns 201", async () => {
    const req = new Request("https://example.com/api/telemetry/launch-mission?src=hero", {
      method: "POST",
      headers: {
        "x-forwarded-for": "9.9.9.9",
        "user-agent": "test-agent",
        cookie: "session_id=xyz",
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.mode).toBe("jsonl");

    const persisted = await readFile(__internal.DEV_FALLBACK_PATH, "utf8");
    expect(persisted).toContain('"ip":"9.9.9.9"');
  });

  it("page is wired to telemetry endpoint", async () => {
    const pageSource = await readFile(new URL("../../../page.tsx", import.meta.url), "utf8");
    expect(pageSource).toContain('/api/telemetry/launch-mission');
    expect(pageSource).toContain("sendLaunchTelemetry");
  });
});
