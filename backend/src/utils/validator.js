export function requireFields(fields = []) {
  return function (req, res, next) {
    const missing = [];

    fields.forEach((f) => {
      if (req.body[f] === undefined || req.body[f] === null) {
        missing.push(f);
      }
    });

    if (missing.length > 0) {
      return res.status(400).json({
        ok: false,
        error: `Missing required fields: ${missing.join(", ")}`
      });
    }

    next();
  };
}

