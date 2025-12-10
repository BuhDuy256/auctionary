const API_URL = import.meta.env.VITE_API_URL as string;

const getToken = (): string | null => localStorage.getItem("token");

const handleResponse = async (response: Response): Promise<any> => {
  // Handle all 401 responses (authentication errors)
  if (response.status === 401) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (e) {
      // Can't parse JSON, use statusText
    }

    const errorMessage = errorData?.message || response.statusText || "Unauthorized";

    // Remove token and dispatch event for auth errors
    // This will trigger logout in AuthContext via event listener
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-error"));
    throw new Error(errorMessage);
  }

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(
        response.statusText || `HTTP error! status: ${response.status}`
      );
    }

    // Backend error format: { success: false, error: "ERROR_CODE", message: "..." }
    // Use 'message' field for human-readable error, not 'error' (which is error code)
    throw new Error(
      errorData?.message || errorData?.error || "API request failed"
    );
  }

  if (response.status === 204) {
    return null;
  }

  try {
    const jsonResponse = await response.json();

    // Check if it's an error response that wasn't caught above (shouldn't happen, but safety check)
    if (jsonResponse && typeof jsonResponse === 'object' && 'success' in jsonResponse && !jsonResponse.success) {
      // Error response: { success: false, error: "...", message: "..." }
      throw new Error(jsonResponse.message || jsonResponse.error || "API request failed");
    }

    // Unwrap the success response format { success: true, data: {...}, message?: string }
    if (jsonResponse && typeof jsonResponse === 'object' && 'success' in jsonResponse && jsonResponse.success) {
      return jsonResponse.data;
    }

    // Fallback for responses without wrapper (shouldn't happen with new backend format)
    return jsonResponse;
  } catch (e: any) {
    // If it's already our thrown error, re-throw it
    if (e.message && !e.message.includes("JSON")) {
      throw e;
    }
    throw new Error("Invalid JSON response from server");
  }
};

const buildOptions = (
  method: string,
  body: any = null,
  requiresAuth = false
): RequestInit => {
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  return options;
};

const request = async (
  endpoint: string,
  options?: RequestInit
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse(response);
  } catch (error) {
    console.error("Network error or fetch failed:", error);
    throw error;
  }
};

const apiClient = {
  get: <T = any>(endpoint: string, requiresAuth = false): Promise<T> => {
    const options = buildOptions("GET", null, requiresAuth);
    return request(endpoint, options);
  },

  post: <T = any>(
    endpoint: string,
    body: unknown,
    requiresAuth = false
  ): Promise<T> => {
    const options = buildOptions("POST", body, requiresAuth);
    return request(endpoint, options);
  },

  patch: <T = any>(
    endpoint: string,
    body: unknown,
    requiresAuth = false
  ): Promise<T> => {
    const options = buildOptions("PATCH", body, requiresAuth);
    return request(endpoint, options);
  },

  delete: <T = any>(endpoint: string, requiresAuth = false): Promise<T> => {
    const options = buildOptions("DELETE", null, requiresAuth);
    return request(endpoint, options);
  },
};

export default apiClient;
