export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err instanceof Error && err.message.includes("Unsupported file type")) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({
    error: "Something went wrong",
    details: err.message,
  });
};
