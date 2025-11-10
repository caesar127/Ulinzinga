import {
  createCategoryService,
  getAllCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
