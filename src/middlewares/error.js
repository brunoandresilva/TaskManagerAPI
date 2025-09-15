function errorMiddleware(err, _req, res, _next) {
  const status = err.status || 500;
  const payload = {
    message: err.message || "Erro interno",
  };
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }
  return res.status(status).json(payload);
}

module.exports = { errorMiddleware };
