/**
 * Extracts the ID from a slug string.
 * Expected formats:
 * - "some-product-name-123" -> "123"
 * - "123" -> "123"
 * 
 * @param slugId The slug string or ID string
 * @returns The extracted ID string
 */
export const extractIdFromSlug = (slugId: string): string => {
  if (!slugId) return "";

  // If it's just a number, return it
  if (/^\d+$/.test(slugId)) {
    return slugId;
  }

  // Try to extract the last segment if it's a number
  const parts = slugId.split('-');
  const lastPart = parts[parts.length - 1];

  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }

  // Fallback: return the whole string (maybe it's a non-numeric ID or just the slug)
  return slugId;
};
