import crypto from "crypto";

/**
 * Generates a cryptographically secure random password
 * that meets the authentication schema requirements:
 * - Exactly 20 characters long
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 *
 * @returns A secure 20-character password
 */
export const generateSecurePassword = (): string => {
  const length = 20;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Combine all character sets
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure at least one character from each required set
  let password = "";

  // Add one random uppercase letter
  password += uppercaseChars[crypto.randomInt(0, uppercaseChars.length)];

  // Add one random lowercase letter
  password += lowercaseChars[crypto.randomInt(0, lowercaseChars.length)];

  // Add one random number
  password += numberChars[crypto.randomInt(0, numberChars.length)];

  // Fill the remaining characters (17 more) with random characters from all sets
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  // Convert to array, shuffle, and join back
  const passwordArray = password.split("");
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
};
