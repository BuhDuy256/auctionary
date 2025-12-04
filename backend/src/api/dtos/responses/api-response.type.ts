export interface BaseResponse {
  success: boolean;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
}
