import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  updateUserProfileService,
  updateUserInterestsService,
} from "./users.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const result = await getUsersService(role, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await updateUserProfileService(req.params.id, req.body);
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUserInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    const user = await updateUserInterestsService(req.params.id, interests);
    res.json({ message: "Interests updated successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
