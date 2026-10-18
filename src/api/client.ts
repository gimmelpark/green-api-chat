function getUrl(baseUrl: string, params?: Record<string, string | number | undefined>): string {
  let paramsString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, `${value}`]),
  ).toString();

  if (paramsString.length) paramsString = "?" + paramsString;

  return baseUrl + paramsString;
}

interface IFetchOptions {
  params?: Record<string, string | number | undefined>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  signal?: AbortSignal;
}

export async function httpFetch<TResponse>(
  url: string,
  { params, method, body, signal }: IFetchOptions = {},
): Promise<TResponse> {
  const response = await fetch(getUrl(url, params), {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}
