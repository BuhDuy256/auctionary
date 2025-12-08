import { useState, useEffect } from "react";

export const useCountdown = (targetDate: string | Date | undefined) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const end = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("ENDED");
        setIsEnded(true);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setIsUrgent(hours < 24); // Đổi màu đỏ nếu còn dưới 24h

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else {
        // Format hh:mm:ss cho kịch tính
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}h ${minutes
            .toString()
            .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
        );
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isUrgent, isEnded };
};
