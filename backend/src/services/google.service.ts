import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID // Lấy từ file .env
);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload; // Chứa email, name, picture, sub (google_id)
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google Token");
  }
};