import express from "express";
import User from "../models/user.model.js";
import generateTokenandSetCookie from "../utils/generateToken.js";
const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "Username already existed" });
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
      const token = generateTokenandSetCookie(newUser._id, res);
      res.status(200).cookie("jwt", token,{
        maxAge: 15 * 24 * 60 * 60 * 3600,
        httpOnly: true,
        sameSite: "strict",
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
      console.log(error);
    return res.status(500).json({ error: "Internal sever error" });
    
  }
};
const login = async (req, res) => {};
const logout = async (req, res) => {};

export { signup, login, logout };
