import { generateToken } from "../lib/utils.js";
import User from "../models/users/user.model.js";
import bcrypt from "bcryptjs";

/**
 * @route POST /auth/signup
 */
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT token and set cookie
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("❌ Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route POST /auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token and set cookie
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("❌ Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route POST /auth/logout
 */
export const logout = (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route GET /auth/check-auth
 */
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("❌ Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
