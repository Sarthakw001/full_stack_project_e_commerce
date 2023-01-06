import User from "../models/user";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";
import mailHelper from "../utils/mailHelper";
import crypto from "crypto";

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

/***********************************************************
 * @ForgotPassword
 * @route http://localhost:/api/auth/forgot
 * @description User will submit email for verification and will generate token
 * @parameters email
 * @return email sent!!!!!!! with OTP
 ***********************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError("Enter the email please!", 404);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User Not found", 404);
  }

  const resetToken = user.generateForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`;
  const text = `Your Password reset link is  \n\n
   ${resetUrl}\n\n`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Password Reset Email",
      text: text,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email}`,
    });
  } catch (error) {
    // delete forgot password token
    user.forgotPasswordToken = undefined;

    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(error.message || "Email sent failure", 500);
  }
});

/***********************************************************
 * @Reset Password
 * @route http://localhost:/api/auth/password/reset/:resetToken
 * @description User will be able to reset the password based on url token
 * @parameters token from url,password and confirm password
 * @return user object
 ***********************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new CustomError("password token invalid or expired", 400);
  }
  if (password !== confirmPassword) {
    throw new CustomError("password and Confirm password doesn't match", 400);
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });
  const token = user.getJwtToken();
  user.password = undefined;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    user,
  });
});

/***********************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:/api/auth/profile
 * @description check for token and populate the req.user
 * @parameters
 * @return user object
 ***********************************************************/

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User Not found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// TODO: create controller for change password
