import User from "./users.model.js";
import bcrypt from "bcryptjs";

export const createUserService = async (userData) => {
  const existing = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });
  if (existing)
    throw new Error("User with this email or username already exists");

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
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).skip(skip).limit(parseInt(limit));

  return {
    users,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
  };
};

export const getUserByIdService = async (id) => {
  const user = await User.findById(id);
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
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserProfileService = async (userId, updateData) => {
  // Prevent role or password changes here unless explicitly handled
  const restrictedFields = ["role", "password", "is_active"];
  restrictedFields.forEach((field) => delete updateData[field]);

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserInterestsService = async (userId, interests) => {
  if (!Array.isArray(interests))
    throw new Error("Interests must be an array of strings");

  const user = await User.findByIdAndUpdate(
    userId,
    { interests },
    { new: true, runValidators: true }
  );

  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};
