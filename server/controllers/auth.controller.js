import express from "express";
import User from "../models/user.model.js";
import generateTokenandSetCookie from "../utils/generateToken.js";
const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "userName already existed" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already existed" });
    }

    const newUser = new User({
      userName,
      email,
      password,
      fullName,
    });
    if (newUser) {
      await newUser.save();
      // console.log(newUser);

      const token = generateTokenandSetCookie(newUser._id);
      res
        .status(200)
        // .cookie("jwt", token, {
        //   maxAge: 15 * 24 * 60 * 60 * 3600,
        //   httpOnly: true,
        //   sameSite: "strict",
        // })
        .json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};
const login = async (req, res) => {
  try {
    const token = req.cookies.jwt; // Access the 'jwt' cookie
  if (token) {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeToken?.id).select(
      "-password "
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    return res.status(200).json(user);
  }
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      user = await User.findOne({ email: userName });
    }
    if (user) {
      const isPasswordCorrect = await user.isPasswordCorrect(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Wrong Password" });
      }
      const token = generateTokenandSetCookie(user._id);
      // console.log(token);
      user.password=""
      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: 15 * 24 * 60 * 60 * 3600,
          httpOnly: true,
          sameSite: "strict",
        })
        .json(user);
    } else {
      return res.res.status(401).json({ error: "Invalid userName" });
    }
  } catch (error) {
    console.log("Error in login controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0, // Set the cookie to expire immediately
      httpOnly: true
    });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.log("Error in logout controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};

const getMe= async (req,res)=>{
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in getMe controller :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
}

const verifyJWTToken = (req,res) =>{

}
export { signup, login, logout ,getMe,verifyJWTToken};
