import { Request, Response, NextFunction } from "express";

const globalErrorHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);
  
  if (error.name === "NotFoundError") {
    res.status(404).json({
      message: error.message,
    });
  } else if (error.name === "ValidationError") {
    res.status(400).json({
      message: error.message,
    });
  } else if (error.name === "UnauthorizedError") {
    res.status(401).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default globalErrorHandlingMiddleware;