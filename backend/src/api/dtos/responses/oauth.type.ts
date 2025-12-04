export interface GoogleUserResponse {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface FacebookUserResponse {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified: boolean;
}
