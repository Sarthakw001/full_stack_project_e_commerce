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

  res.cookie("token",token,cookieOptions);
  res.status(200).json({
    success:true,
    token,
    user
  });
});
