import { useState, useCallback } from "react";

// T là kiểu dữ liệu trả về (ví dụ: User, Auction[], v.v.)
// P là kiểu dữ liệu của tham số (ví dụ: [string] cho id)

/**
 * Hook 2: useApiRequest (Thủ công)
 * Dùng để THỰC HIỆN API (POST, PATCH, DELETE) khi có hành động (ví dụ: click).
 * Hook này trả về một hàm `execute` để bạn gọi bất cứ khi nào.
 *
 * @returns { object } Trả về { execute, data, isLoading, error }
 */
export const useApiRequest = <T, P extends any[]>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Hàm để thực thi.
   * @param apiFunc Hàm API để gọi (ví dụ: authService.login)
   * @param args Các tham số cho hàm API (ví dụ: 'email', 'password')
   */
  const execute = useCallback(
    async (
      apiFunc: (...args: P) => Promise<T>,
      ...args: P
    ): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result; // Trả về kết quả để component có thể await
      } catch (err) {
        setError(err as Error);
        throw err; // Ném lỗi ra để component có thể .catch()
      } finally {
        setIsLoading(false);
      }
    },
    [] // Hàm execute này không bao giờ thay đổi
  );

  return { execute, data, isLoading, error };
};
