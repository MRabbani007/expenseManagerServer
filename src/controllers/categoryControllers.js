import Category from "../db_schemas/category.js";

export const getCategories = async (req, res) => {
  try {
    const data = await Category.find({});
    if (!data) {
      return res.sendStatus(204);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = req?.body?.category;

    let { id, label, value, icon } = category;

    const data = await Category.create({
      id,
      label,
      value,
      icon,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const editCategory = async (req, res) => {
  try {
    const category = req?.body?.category;

    if (!category) return res.sendStatus(400);

    let { id, label, value, icon } = category;

    let data = await Category.updateOne(
      {
        id,
      },
      {
        $set: { label, value, icon },
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req?.body?.id;

    if (!id) return res.sendStatus(400);

    let data = await Category.deleteOne({
      id,
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};
