import { describe, expect, it } from "vitest";

import { extractLaunchMissionTelemetry } from "@/lib/telemetry";

describe("extractLaunchMissionTelemetry", () => {
  it("extracts bounded telemetry fields and allowlisted cookies", () => {
    const req = new Request("https://example.com/api/telemetry/launch-mission?utm_source=x&campaign=alpha", {
      method: "POST",
      headers: {
        "x-forwarded-for": "1.2.3.4, 5.6.7.8",
        "user-agent": "Mozilla/5.0 Test",
        "accept-language": "en-US,en;q=0.9",
        referer: "https://futurefood.club/",
        cookie: "session_id=abc123; auth_token=secret; user_id=user_99; theme=dark",
      },
    });

    const out = extractLaunchMissionTelemetry(req);

    expect(out.ip).toBe("1.2.3.4");
    expect(out.method).toBe("POST");
    expect(out.path).toBe("/api/telemetry/launch-mission");
    expect(out.queryParams).toEqual({ utm_source: "x", campaign: "alpha" });
    expect(out.cookies).toEqual({ session_id: "abc123", user_id: "user_99" });
    expect(new Date(out.timestamp).toString()).not.toBe("Invalid Date");
  });
});
