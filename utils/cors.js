exports.corsFun = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:4200",
    "https://ecommerce-website-frontend-rho.vercel.app",
  ];
  const origin = req.headers.origin;

  // Check if the origin of the request is in the allowedOrigins array
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
};
