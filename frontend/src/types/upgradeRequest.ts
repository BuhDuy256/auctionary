export type UpgradeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled";

export interface UpgradeRequest {
  requestId: number;
  userId: number;
  status: UpgradeRequestStatus;
  message: string;
  createdAt: string;
  approvedAt: string | null;
  expiresAt: string;
}

export interface UpgradeRequestStatusResponse {
  request: UpgradeRequest | null;
}

export interface SubmitUpgradeRequestResponse {
  requestId: number;
  message: string;
}

export interface CancelUpgradeRequestResponse {
  message: string;
}
