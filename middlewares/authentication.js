const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // Getting auth headers
  const authHeader = req.headers.authorization;

  // Check for proper headers
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Failed!");
  }

  // Getting the token
  const token = authHeader.split(" ")[1];

  //   Export the auth and invoke the next()
  try {
    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Functionality to remove user
    // const user = await User.findById(payload.id).select('-password');
    // req.user = user;

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Failed!");
  }
};

module.exports = auth;
