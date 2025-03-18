const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api-inference.huggingface.co", // ✅ Hugging Face API Base URL
      changeOrigin: true,
      secure: true,
      pathRewrite: { "^/api": "" }, // ✅ Removes "/api" before forwarding request
      logLevel: "debug", // ✅ Debugging mode
    })
  );
};
