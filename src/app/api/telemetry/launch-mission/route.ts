import { NextResponse } from "next/server";

import { extractLaunchMissionTelemetry } from "@/lib/telemetry";
import { persistLaunchMissionTelemetry } from "@/lib/telemetry-store";

const MAX_BODY_BYTES = 64 * 1024;

class PayloadTooLargeError extends Error {}

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.toLowerCase().startsWith("application/json");
}

async function readRequestBodyWithLimit(request: Request, maxBytes: number): Promise<string> {
  const body = request.body;
  if (!body) return "";

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let rawBody = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      throw new PayloadTooLargeError("Payload Too Large");
    }

    rawBody += decoder.decode(value, { stream: true });
  }

  rawBody += decoder.decode();
  return rawBody;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!isJsonContentType(contentType)) {
    return NextResponse.json({ ok: false, error: "Unsupported Media Type" }, { status: 415 });
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isFinite(contentLength) || contentLength < 0) {
      return NextResponse.json({ ok: false, error: "Invalid Content-Length" }, { status: 400 });
    }

    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload Too Large" }, { status: 413 });
    }
  }

  let rawBody = "";
  try {
    rawBody = await readRequestBodyWithLimit(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ ok: false, error: "Payload Too Large" }, { status: 413 });
    }

    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed JSON" }, { status: 400 });
  }

  if (!parsedBody || typeof parsedBody !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 422 });
  }

  try {
    const telemetry = extractLaunchMissionTelemetry(request);
    const persisted = await persistLaunchMissionTelemetry(telemetry);

    return NextResponse.json({ ok: true, mode: persisted.mode }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
