import Collection from "../models/collection";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";

/***********************************************************
 * @Create Collection
 * @route http://localhost:/api/collection
 * @description User signup controller for creating new user
 * @parameters name,email,password
 * @return User Object
 ***********************************************************/
export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }
  const collection = await Collection.create({
    name,
  });
  res.status(200).json({
    success: true,
    message: " Collection Created Successfully",
    collection,
  });
});

/***********************************************************
 * @Update Collection
 * @route http://localhost:/api/collection/
 * @description User signup controller for creating new user
 * @parameters name,email,password
 * @return User Object
 ***********************************************************/

export const updateCollection = asyncHandler(async (req, res) => {
  // existing value to be updated
  const { id: collectionId } = req.params;
  // new value for updation
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCollection) {
    throw new CustomError("Collection not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "collection updated succesfully",
    updateCollection,
  });
});

/***********************************************************
 * @Delete Collection
 * @route http://localhost:/api/collection/
 * @description User signup controller for creating new user
 * @parameters name,email,password
 * @return User Object
 ***********************************************************/

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const deletedCollection = await Collection.findByIdAndDelete(collectionId);

  if (!deleteCollection) {
    throw new CustomError("Collection not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "collection deleted succesfully",
  });
});

/***********************************************************
 * @Get a list of Collection
 * @route http://localhost:/api/collection
 * @description User signup controller for creating new user
 * @parameters name,email,password
 * @return User Object
 ***********************************************************/

export const getAllCollection = asyncHandler(async (_req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new CustomError("Collection not found", 400);
  }
  res.status(200).json({
    success: true,
    collections,
  });
});
