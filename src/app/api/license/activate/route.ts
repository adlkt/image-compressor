// Creem license 激活代理：服务端持有 CREEM_API_KEY，前端只传 license key。
// 文档：https://docs.creem.io/features/addons/licenses
// POST /v1/licenses/activate  body: { key, instance_name }
// 响应含 status: "active" | "inactive" | "expired" | "disabled"

const CREEM_ACTIVATE_URL = "https://api.creem.io/v1/licenses/activate";

export async function POST(req: Request) {
  let key: unknown;
  try {
    ({ key } = await req.json());
  } catch {
    return Response.json({ valid: false, error: "invalid body" }, { status: 400 });
  }

  const trimmed = typeof key === "string" ? key.trim() : "";
  if (!trimmed) {
    return Response.json({ valid: false, error: "missing key" }, { status: 400 });
  }

  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { valid: false, error: "license service not configured" },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(CREEM_ACTIVATE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ key: trimmed, instance_name: "web-app" }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.status === "active") {
      return Response.json({ valid: true });
    }
    return Response.json(
      { valid: false, status: data?.status ?? null },
      { status: res.ok ? 200 : 402 },
    );
  } catch {
    return Response.json({ valid: false, error: "upstream error" }, { status: 502 });
  }
}
