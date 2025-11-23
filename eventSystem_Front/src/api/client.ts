const API_BASE_URL = "http://localhost:3000";

export interface TxResponse<T> {
  ok: boolean;
  data?: T;
  code?: string;
  error?: string;
}

export async function callTx<T>(
  tx: string,
  params: unknown[] = []
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante: manda cookie "sid"
      body: JSON.stringify({ tx, params }),
    });

    let payload: TxResponse<T>;

    try {
      payload = (await response.json()) as TxResponse<T>;
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      const msg = payload?.error || `HTTP error ${response.status}`;
      const code = payload?.code || "HTTP_ERROR";
      throw new Error(`${code}: ${msg}`);
    }

    if (!payload.ok) {
      const code = payload.code || "BUSINESS_ERROR";
      const msg = payload.error || "Unknown business error";
      throw new Error(`${code}: ${msg}`);
    }

    if (payload.data === undefined) {
      return undefined as T; // para casos void
    }

    return payload.data;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Network error");
  }
}
