import * as ContentService from "./content.service.js";

export const createContent = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user?.id };
    const content = await ContentService.createContent(data);
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const filters = {};
    if (req.query.event) filters.event = req.query.event;
    const contentList = await ContentService.getAllContent(filters);
    res.status(200).json(contentList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await ContentService.getContentById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updated = await ContentService.updateContent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Content not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const deleted = await ContentService.deleteContent(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Content not found" });
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
