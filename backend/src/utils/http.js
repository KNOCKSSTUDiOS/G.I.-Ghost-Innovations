export function json(res, data = {}, status = 200) {
  res.status(status).json(data);
}

export function send(res, data = "", status = 200) {
  res.status(status).send(data);
}

export function status(res, code = 200) {
  res.status(code);
  return res;
}
