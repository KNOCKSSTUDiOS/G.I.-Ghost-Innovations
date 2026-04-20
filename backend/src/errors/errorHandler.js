import { HttpError } from "./httpError.js";
import { send } from "../lib/response.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return send(res, { error: err.message }, err.status);
  }

  console.error("Unhandled Error:", err);
  return send(res, { error: "Internal Server Error" }, 500);
};

