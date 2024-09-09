import Description from "../db_schemas/description.js";

export const getDescriptions = async (req, res) => {
  try {
    const data = await Description.find({});
    if (!data) {
      return res.sendStatus(204);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const createDescription = async (req, res) => {
  try {
    const description = req?.body?.description;

    let { id, label, value, category, categoryID, isSelected, icon } =
      description;

    const data = await Description.create({
      id,
      label,
      category,
      categoryID,
      isSelected,
      value,
      icon,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const editDescription = async (req, res) => {
  try {
    const description = req?.body?.description;

    if (!description) return res.sendStatus(400);

    let { id, label, value, category, categoryID, isSelected, icon } =
      description;

    let data = await Description.updateOne(
      {
        id,
      },
      {
        $set: { label, value, category, categoryID, isSelected, icon },
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteDescription = async (req, res) => {
  try {
    const id = req?.body?.id;

    if (!id) return res.sendStatus(400);

    let data = await Description.deleteOne({
      id,
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};
