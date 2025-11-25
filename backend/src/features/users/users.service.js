import User from "./users.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const createUserService = async (userData) => {
  const exists = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });
  if (exists) throw new Error("User with this email or username already exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: hashedPassword,
  });
};

export const getUsersService = async (role, query = {}) => {
  const { page = 1, limit = 10, search } = query;
  const filter = role ? { role } : {};

  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { "profile.name": { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .select("-password");

  return {
    users,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
  };
};

export const getUserByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

  const user = await User.findById(id).select("-password").populate("interests");
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserProfileService = async (userId, updateData) => {
  const restricted = ["role", "password", "is_active"];
  restricted.forEach((field) => delete updateData[field]);

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserInterestsService = async (userId, interests) => {
  if (!Array.isArray(interests)) throw new Error("Interests must be an array");

  const objectIds = interests.map((id) => new mongoose.Types.ObjectId(id));

  const user = await User.findByIdAndUpdate(
    userId,
    { interests: objectIds },
    { new: true, runValidators: true }
  ).populate("interests");

  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};
