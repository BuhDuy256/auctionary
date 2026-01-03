/**
 * Format a date to a relative time string (e.g., "3 days ago", "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

/**
 * Calculate time left until a date and format it as a string
 */
export const calculateTimeLeft = (endTimeString: string): string => {
  const endTime = new Date(endTimeString);
  const now = new Date();
  const diffMs = endTime.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMinutes % 60}m`;
  if (diffMinutes > 0) return `${diffMinutes}m`;
  return `${diffSeconds}s`;
};

/**
 * Format a timestamp for chat messages
 * - Less than 1 minute: "Just now"
 * - Less than 1 hour: "Xm ago"
 * - Less than 24 hours: "Xh ago"
 * - Less than 7 days: "Mon 10:30 AM"
 * - Older: "Dec 25, 10:30 AM"
 */
export const formatChatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Less than 1 minute
  if (diffMinutes < 1) return "Just now";

  // Less than 1 hour
  if (diffHours < 1) return `${diffMinutes}m ago`;

  // Less than 24 hours
  if (diffDays < 1) return `${diffHours}h ago`;

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const timeStr = `${displayHours}:${minutes} ${ampm}`;

  // Less than 7 days - show day of week
  if (diffDays < 7) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${dayNames[date.getDay()]} ${timeStr}`;
  }

  // Older - show full date
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${timeStr}`;
};

/**
 * Format a timestamp for hover text (title attribute)
 * - Same day: "10:30 AM"
 * - Same year: "Jan 3, 10:30 AM"
 * - Different year: "Jan 3, 2025, 10:30 AM"
 */
export const formatFullTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const timeStr = `${displayHours}:${minutes} ${ampm}`;

  // Check if same day
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return timeStr;
  }

  // Check if same year
  const isSameYear = date.getFullYear() === now.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;

  if (isSameYear) {
    return `${dateStr}, ${timeStr}`;
  }

  // Different year - include year
  return `${dateStr}, ${date.getFullYear()}, ${timeStr}`;
};
