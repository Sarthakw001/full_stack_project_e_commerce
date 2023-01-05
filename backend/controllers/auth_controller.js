import User from "../models/user";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/***********************************************************
 * @SIGNUP
 * @route http://localhost:/api/auth/signup
 * @description User signup controller for creating new user
 * @parameters name,email,password
 * @return User Object
 ***********************************************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Please Fill all fields", 400);
  }
  // check if User exist

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already Exist", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  // console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/***********************************************************
 * @SIGNIN
 * @route http://localhost:/api/auth/login
 * @description User Login controller for creating Logging in
 * @parameters email,password
 * @return User Object
 ***********************************************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please Fill all details", 400);
  }

  const existingUser = await User.findOne({ email }).select("+password");
  if (existingUser) {
    const isPassword = await existingUser.comparePassword(password);
    if (isPassword) {
      const token = existingUser.getJwtToken();
      existingUser.password = undefined;
      res.cookie("token", token, cookieOptions);
      return res.status(200).json({
        success: true,
        token,
        existingUser,
      });
    } else {
      throw new CustomError("Invalid Credentials", 400);
    }
  } else {
    throw new CustomError("Invalid Credentials", 400);
  }
});

/***********************************************************
 * @LOGOUT
 * @route http://localhost:/api/auth/loGOUT
 * @description User LogOut by clearing user cookies
 * @parameters
 * @return success message
 ***********************************************************/

export const logout = asyncHandler(async (_req, res) => {
  // res.clearCookie();
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
