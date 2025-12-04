import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../dtos/responses/api-response.type';

export const responseInterceptor = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json.bind(res);

  let responseMessage: string | undefined;

  res.json = function (data: any) {
    // If already has 'success' field, it's already formatted (error or pre-formatted response)
    if (data && typeof data === 'object' && 'success' in data) {
      return originalJson(data);
    }

    // Otherwise, wrap in SuccessResponse format
    const wrappedData: SuccessResponse = {
      success: true,
      data,
    };

    if (responseMessage) {
      wrappedData.message = responseMessage;
    }

    return originalJson(wrappedData);
  };

  res.message = function (msg: string): Response {
    responseMessage = msg;
    return this;
  };

  next();
};
