const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function fetcher(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} — ${text}`);
  }
  return res.json();
}