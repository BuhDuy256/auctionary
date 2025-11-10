import { useState, useEffect } from "react";

// T là kiểu dữ liệu trả về (ví dụ: User, Auction[], v.v.)
// P là kiểu dữ liệu của tham số (ví dụ: [string] cho id)

/**
 * Hook 1: useApi (Tự động)
 * Dùng để GỌI API (phương thức GET) ngay khi component được render.
 * Rất lý tưởng để lấy dữ liệu hiển thị (ví dụ: danh sách, chi tiết).
 *
 * @param apiFunc Hàm API để gọi (ví dụ: () => auctionService.getAuctions())
 * @param deps Mảng dependency để thực thi lại (ví dụ: [auctionId])
 */
export const useApi = <T>(
  // Hàm apiFunc phải được bọc trong useCallback ở component cha
  apiFunc: () => Promise<T>,
  deps: any[] = [] // Mảng dependency
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunc, ...deps]); // Chạy lại khi hàm API hoặc dependency thay đổi

  return { data, isLoading, error };
};
