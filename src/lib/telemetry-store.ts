import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { LaunchMissionTelemetry } from "@/lib/telemetry";

const DEFAULT_TABLE = "launch_mission_telemetry";
const DEV_FALLBACK_PATH = join(process.cwd(), ".telemetry", "launch-mission.jsonl");

export type PersistResult = {
  mode: "supabase" | "jsonl";
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.TELEMETRY_TABLE_NAME || DEFAULT_TABLE;

  if (!url || !serviceRole) {
    return null;
  }

  return { url, serviceRole, table };
}

async function persistJsonl(data: LaunchMissionTelemetry): Promise<PersistResult> {
  await mkdir(dirname(DEV_FALLBACK_PATH), { recursive: true });
  await appendFile(DEV_FALLBACK_PATH, `${JSON.stringify(data)}\n`, "utf8");
  return { mode: "jsonl" };
}

async function persistSupabase(
  config: NonNullable<ReturnType<typeof getSupabaseConfig>>,
  data: LaunchMissionTelemetry,
): Promise<PersistResult> {
  const client = createClient(config.url, config.serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const payload = {
    timestamp: data.timestamp,
    ip: data.ip,
    user_agent: data.userAgent,
    accept_language: data.acceptLanguage,
    referer: data.referer,
    method: data.method,
    path: data.path,
    query_params: data.queryParams,
    cookies: data.cookies,
  };

  const { error } = await client.from(config.table).insert(payload);
  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return { mode: "supabase" };
}

export async function persistLaunchMissionTelemetry(data: LaunchMissionTelemetry): Promise<PersistResult> {
  const config = getSupabaseConfig();

  if (!config) {
    return persistJsonl(data);
  }

  return persistSupabase(config, data);
}

export const __internal = {
  DEV_FALLBACK_PATH,
};
