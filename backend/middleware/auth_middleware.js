import User from "../models/user";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";
import JWT from "jsonwebtoken";
import config from "../config/index";

export const isLoggedin = asyncHandler(async (req, _res, next) => {
  let token;
  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not Authorized to access this route", 401);
  }
  try {
    const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);

    // _id, find user based on id

    req.user = await User.findById(decodedJWTPayload._id, "name email role");

    next();
  } catch (error) {
    throw new CustomError("Not Authorized to access this route", 401);
  }
});
