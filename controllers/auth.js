const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  /*
    Check the user request, if false show error and stop
    if right Create a model and send response
  */

  // Create user
  const user = await User.create({ ...req.body });

  // Generate JWT
  const token = user.createJWT();

  // Send response
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // No value is passed in any field
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Check user
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid details!");
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid details!");
  }

  // Generate JWT
  const token = user.createJWT();

  // Send response
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
