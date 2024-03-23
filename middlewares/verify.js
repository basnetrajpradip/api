const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    renewToken(req, res, next);
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        /*  return res.status(401).json({ valid: false, message: "Invalid Access Token" }); */
        next();
      } else {
        const userPayload = {
          id: decoded.user.id,
          username: decoded.user.username,
          isAuthor: decoded.user.isAuthor,
        };
        req.user = userPayload;
        next();
      }
    });
  }
};

const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    /* return res.status(401).json({ valid: false, message: "No Refresh Token" }); */
    next();
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        /* return res.status(401).json({ valid: false, message: "Invalid Refresh Token" }); */
        next();
      } else {
        const userPayload = {
          id: decoded.user.id,
          username: decoded.user.username,
          isAuthor: decoded.user.isAuthor,
        };
        const accessToken = jwt.sign({ user: userPayload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
        res.cookie("accessToken", accessToken, { maxAge: 60000, sameSite: "none" });
        req.user = userPayload;
        next();
      }
    });
  }
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization || req.header.Authorization;
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ message: "Missing Authorization Header" });
  }
};
