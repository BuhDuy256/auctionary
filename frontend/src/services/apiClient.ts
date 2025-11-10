// Get the API base URL from your environment variables
const API_URL = import.meta.env.VITE_API_URL as string;

/**
 * Gets the JWT token from local storage.
 * @returns {string | null} The token or null if not found.
 */
const getToken = (): string | null => localStorage.getItem("token");

/**
 * A generic function to handle the API response.
 * It handles global 401 errors, response parsing, and error throwing.
 * @param {Response} response - The raw response from fetch()
 * @returns {Promise<any>} The JSON data
 * @throws {Error} If the response is not ok
 */
const handleResponse = async (response: Response): Promise<any> => {
  // NÂNG CẤP 1: Xử lý 401 (Unauthorized) toàn cục
  // Nếu token hết hạn hoặc không hợp lệ, API sẽ trả về 401.
  if (response.status === 401) {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    // (Tùy chọn) Xóa thông tin người dùng khỏi context/redux
    // ...

    // Thông báo cho các phần khác của app (ví dụ: React context) biết là đã bị logout
    // Cách này tốt hơn là window.location.href vì nó cho phép SPA xử lý mượt mà
    window.dispatchEvent(new Event("auth-error"));
    
    // Ném lỗi cụ thể để component có thể bắt
    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  }

  // NÂNG CẤP 2: Kiểm tra `ok` TRƯỚC khi parse JSON
  if (!response.ok) {
    let errorData: any;
    try {
      // Thử lấy nội dung lỗi từ server (thường là JSON)
      errorData = await response.json();
    } catch (e) {
      // Nếu server lỗi 500 và trả về HTML, .json() sẽ thất bại.
      // Chúng ta ném lỗi dựa trên statusText.
      throw new Error(response.statusText || `HTTP error! status: ${response.status}`);
    }
    // Nếu server trả về lỗi JSON, dùng message từ server
    throw new Error(errorData?.error || errorData?.message || "API request failed");
  }

  // Xử lý trường hợp 204 No Content (thường dùng cho DELETE)
  // response.json() sẽ lỗi vì không có body
  if (response.status === 204) {
    return null;
  }

  // Nếu mọi thứ ổn, trả về JSON
  try {
    return await response.json();
  } catch (e) {
    throw new Error("Invalid JSON response from server");
  }
};

/**
 * A helper function to build the request configuration.
 * (Không thay đổi so với code của bạn - đã rất tốt)
 * @param {string} method - 'GET', 'POST', 'PATCH', 'DELETE'
 * @param {object} [body] - The JSON body for POST/PATCH requests
 * @param {boolean} [requiresAuth=false] - Whether to send the Authorization header
 * @returns {object} The configuration object for fetch()
 */
const buildOptions = (method: string, body: unknown = null, requiresAuth = false): RequestInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(
        "Auth required for this request, but no token is available."
      );
      // Thay vì chỉ cảnh báo, bạn có thể ném lỗi ở đây để chặn request
      // throw new Error("Bạn chưa đăng nhập để thực hiện hành động này.");
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  // Ép kiểu `options` để TypeScript hiểu
  return options;
};

/**
 * Hàm request lõi để tránh lặp code
 * @param {string} endpoint - The API endpoint
 * @param {RequestInit} options - The fetch options
 * @returns {Promise<any>}
 */
const request = async (endpoint: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse(response);
  } catch (error) {
    // Xử lý các lỗi mạng (network down, DNS lookup failed, etc.)
    console.error("Network error or fetch failed:", error);
    // Ném lại lỗi để component/service có thể bắt
    throw error;
  }
};

/**
 * The main api service object with methods for each HTTP verb.
 */
const apiClient = {
  get: (endpoint: string, requiresAuth = false): Promise<any> => {
    const options = buildOptions("GET", null, requiresAuth);
    return request(endpoint, options);
  },

  post: (endpoint: string, body: unknown, requiresAuth = false): Promise<any> => {
    const options = buildOptions("POST", body, requiresAuth);
    return request(endpoint, options);
  },

  patch: (endpoint: string, body: unknown, requiresAuth = false): Promise<any> => {
    const options = buildOptions("PATCH", body, requiresAuth);
    return request(endpoint, options);
  },

  delete: (endpoint: string, requiresAuth = false): Promise<any> => {
    const options = buildOptions("DELETE", null, requiresAuth);
    return request(endpoint, options);
  },
};

export default apiClient;