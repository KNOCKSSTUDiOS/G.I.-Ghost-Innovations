export function statusText(code = 200) {
  const map = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error"
  };
  return map[code] || "Unknown";
}

export function isSuccess(code = 200) {
  return code >= 200 && code < 300;
}
