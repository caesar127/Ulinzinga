import axios from "axios";
import dotenv from "dotenv";
import EventCategory from "./category.model.js";

dotenv.config({quiet: true});

const PAYCHANGU_API_BASE = "https://dashboard.paychangu.com/mobile/api/public";
const PAYCHANGU_E_API_KEY = process.env.PAYCHANGU_E_API_KEY;

const makePayChanguRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const config = {
      method,
      url: `${PAYCHANGU_API_BASE}${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${PAYCHANGU_E_API_KEY}`,
      },
    };
    if (data) config.data = data;
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    throw new Error(errMsg);
  }
};

export const syncCategoriesFromPayChangu = async () => {
  const apiResponse = await makePayChanguRequest("/events/categories/all");
  if (!apiResponse?.data?.length) return 0;

  for (const apiCat of apiResponse.data) {
    await EventCategory.findOneAndUpdate(
      { categoryId: apiCat.id },
      {
        categoryId: apiCat.id,
        name: apiCat.name,
        color: apiCat.color || "#3b82f6",
        is_active: apiCat.is_active !== false,
      },
      { upsert: true, new: true }
    );
  }

  return apiResponse.data.length;
};

export const createCategoryService = async (categoryData) => {
  const existing = await EventCategory.findOne({
    $or: [{ categoryId: categoryData.id }, { name: categoryData.name }],
  });
  if (existing) throw new Error("Category already exists");

  const category = await EventCategory.create({
    categoryId: categoryData.id,
    name: categoryData.name,
    color: categoryData.color || "#3b82f6",
    is_active: categoryData.is_active !== false,
  });

  return category;
};

export const getAllCategoriesService = async (sync = true) => {
  if (sync) await syncCategoriesFromPayChangu();
  return await EventCategory.find({}).sort({ name: 1 });
};

export const getCategoryByIdService = async (id) => {
  let category = await EventCategory.findOne({ categoryId: id });
  if (!category) {
    const apiResponse = await makePayChanguRequest(`/events/categories/${id}`);
    if (!apiResponse?.data) throw new Error("Category not found in PayChangu");

    category = await EventCategory.create({
      categoryId: apiResponse.data.id,
      name: apiResponse.data.name,
      color: apiResponse.data.color || "#3b82f6",
      is_active: apiResponse.data.is_active !== false,
    });
  }
  return category;
};

export const updateCategoryService = async (id, updateData) => {
  return await EventCategory.findOneAndUpdate({ categoryId: id }, updateData, {
    new: true,
  });
};

export const deleteCategoryService = async (id) => {
  return await EventCategory.findOneAndDelete({ categoryId: id });
};
