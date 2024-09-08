exports.corsFun = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // replace with actual methods you want to allow
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
};
