import { NextResponse } from "next/server";

import { extractLaunchMissionTelemetry } from "@/lib/telemetry";
import { persistLaunchMissionTelemetry } from "@/lib/telemetry-store";

export async function POST(request: Request) {
  try {
    const telemetry = extractLaunchMissionTelemetry(request);
    const persisted = await persistLaunchMissionTelemetry(telemetry);

    return NextResponse.json({ ok: true, mode: persisted.mode }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
