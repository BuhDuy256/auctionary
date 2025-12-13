export interface UpgradeRequestStatus {
  requestId: number;
  userId: number;
  status: "pending" | "approved" | "rejected" | "expired" | "cancelled";
  message: string;
  createdAt: string;
  approvedAt: string | null;
  expiresAt: string;
}

export interface UpgradeRequestStatusResponse {
  request: UpgradeRequestStatus | null;
}

export interface SubmitUpgradeRequestResponse {
  requestId: number;
  message: string;
}

export interface CancelUpgradeRequestResponse {
  message: string;
}
