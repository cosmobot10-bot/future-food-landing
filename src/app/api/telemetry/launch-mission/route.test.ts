import { readFile, rm } from "node:fs/promises";

import { afterEach, describe, expect, it } from "vitest";

import { __internal } from "@/lib/telemetry-store";
import { POST } from "./route";

afterEach(async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  await rm(__internal.DEV_FALLBACK_PATH, { force: true });
});

function makeRequest({
  body,
  contentType = "application/json",
  contentLength,
}: {
  body?: string;
  contentType?: string;
  contentLength?: string;
}) {
  const headers: Record<string, string> = {
    "x-forwarded-for": "9.9.9.9",
    "user-agent": "test-agent",
    cookie: "session_id=xyz",
  };

  if (contentType) {
    headers["content-type"] = contentType;
  }

  if (contentLength) {
    headers["content-length"] = contentLength;
  }

  return new Request("https://example.com/api/telemetry/launch-mission?src=hero", {
    method: "POST",
    headers,
    body,
  });
}

describe("POST /api/telemetry/launch-mission", () => {
  it("records telemetry and returns 201", async () => {
    const req = makeRequest({ body: JSON.stringify({ event: "launch_mission" }) });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.mode).toBe("jsonl");

    const persisted = await readFile(__internal.DEV_FALLBACK_PATH, "utf8");
    expect(persisted).toContain('"ip":"9.9.9.9"');
  });

  it("rejects non-JSON content type", async () => {
    const req = makeRequest({ body: "event=launch_mission", contentType: "text/plain" });

    const response = await POST(req);
    expect(response.status).toBe(415);

    const json = await response.json();
    expect(json.ok).toBe(false);
  });

  it("rejects malformed JSON", async () => {
    const req = makeRequest({ body: '{"event":"launch_mission"' });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.ok).toBe(false);
  });

  it("rejects request larger than 64KB by content-length", async () => {
    const req = makeRequest({
      body: JSON.stringify({ event: "launch_mission" }),
      contentLength: String(70 * 1024),
    });

    const response = await POST(req);
    expect(response.status).toBe(413);
  });

  it("rejects request larger than 64KB by actual body size", async () => {
    const hugeValue = "a".repeat(70 * 1024);
    const req = makeRequest({
      body: JSON.stringify({ event: hugeValue }),
    });

    const response = await POST(req);
    expect(response.status).toBe(413);
  });

  it("page is wired to telemetry endpoint", async () => {
    const pageSource = await readFile(new URL("../../../page.tsx", import.meta.url), "utf8");
    expect(pageSource).toContain('/api/telemetry/launch-mission');
    expect(pageSource).toContain("sendLaunchTelemetry");
  });
});
