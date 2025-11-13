import Content from "./content.model.js";

export const createContent = async (data) => {
  return await Content.create(data);
};

export const getAllContent = async (filters = {}) => {
  return await Content.find(filters)
    .populate("event", "title location date")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

export const getContentById = async (id) => {
  return await Content.findById(id)
    .populate("event", "title location date")
    .populate("createdBy", "name email");
};

export const updateContent = async (id, updates) => {
  return await Content.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteContent = async (id) => {
  return await Content.findByIdAndDelete(id);
};
