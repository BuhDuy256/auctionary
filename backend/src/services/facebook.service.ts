import axios from "axios";
import { FacebookUserResponse } from "../api/dtos/responses/oauth.type";

export const verifyFacebookToken = async (accessToken: string): Promise<FacebookUserResponse> => {
  try {
    const response = await axios.get("https://graph.facebook.com/me", {
      params: {
        access_token: accessToken,
        fields: "id,name,email,picture.type(large)",
      },
    });

    const data = response.data;

    if (!data || !data.id) {
      throw new Error("Invalid Facebook Token");
    }

    return {
      sub: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture?.data?.url,
      email_verified: !!data.email,
    };
  } catch (error) {
    console.error("Facebook verification error:", error);
    throw new Error("Facebook authentication failed");
  }
};
