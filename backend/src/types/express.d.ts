import { SuccessResponse, ErrorResponse } from '../api/dtos/responses/api-response.type';

declare global {
  namespace Express {
    interface Response {
      message(msg: string): this;
      json(data: any): Response<SuccessResponse | ErrorResponse>;
    }
  }
}

export { };
