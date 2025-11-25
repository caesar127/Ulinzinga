export const success = (res, message = "Success", data = {}, status = 200) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

export const fail = (res, message = "Failed", status = 400, errors = null) => {
  return res.status(status).json({
    status: "fail",
    message,
    errors,
  });
};

export const error = (
  res,
  message = "Server Error",
  status = 500,
  details = null
) => {
  return res.status(status).json({
    status: "error",
    message,
    details,
  });
};
