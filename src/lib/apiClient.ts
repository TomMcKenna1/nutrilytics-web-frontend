import { auth } from "./firebase";

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>;
  requiresAuth?: boolean;
  customHeaders?: HeadersInit;
}

/**
 * A centralised and reusable wrapper around the browser's fetch API.
 * This client handles base URL configuration, authentication headers,
 * content types, and standardised error handling.
 */
const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> => {
  const {
    body,
    requiresAuth = true,
    customHeaders = {},
    ...customConfig
  } = options;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  if (requiresAuth) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Authentication required, but no user is logged in.");
    }
    const idToken = await currentUser.getIdToken();
    headers.set("Authorization", `Bearer ${idToken}`);
  }

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message ||
      `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return Promise.resolve(null as T);
  }

  return response.json();
};

export default apiClient;
