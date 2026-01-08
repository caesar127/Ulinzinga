import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  updateUserProfileService,
  updateUserPictureService,
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

export const updateUserPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Use user ID from token instead of path parameter
    const userId = req.user.id || req.user.userId;
    
    const user = await updateUserPictureService(
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    res.json({ message: "Profile picture updated successfully", user });
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
