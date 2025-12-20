/**
 * Format ISO date string to human-readable time
 * @param isoString - ISO date string (e.g., "2025-12-20T10:30:00Z")
 * @returns Formatted time (e.g., "10:30 AM")
 */
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return isoString;
  }
};

/**
 * Format ISO date string to human-readable date
 * @param isoString - ISO date string
 * @returns Formatted date (e.g., "Dec 20, 2025")
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
};

/**
 * Format ISO date string to full date and time
 * @param isoString - ISO date string
 * @returns Formatted date and time (e.g., "Dec 20, 2025 at 10:30 AM")
 */
export const formatDateTime = (isoString: string): string => {
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
};
