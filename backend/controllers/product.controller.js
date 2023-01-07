import Product from "../models/product";
import formidable from "formidable";
import fs from "fs";
import { s3FileUpload, s3deletFile } from "../services/imageUploader";
import Mongoose from "mongoose";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";
import config from "../config/index";

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(err.message || "Something went wrong");
      }
      let productId = new Mongoose.Types.ObjectId().toHexString();

      //   console.log(fields,files);

      // check for fields
      if (
        !fields.name ||
        !fields.price ||
        !fields.description ||
        !fields.collectionId
      ) {
        throw new CustomError("Please fill all details", 500);
      }
      // handling image
      let imageArrayResp = Promise.all(
        Object.keys(files).map(async (filekey, index) => {
          const element = files[filekey];
          const data = fs.readFileSync(element.filepath);
          const upload = await s3FileUpload({
            bucketName: config.S3_BUCKET_NAME,
            key: `products/${productId}/photo_${index + 1}.png`,
            body: data,
            contentType: element.mimetype,
          });
          return {
            secure_url: upload.Location,
          };
        })
      );

      let imgArray = await imageArrayResp;

      const product = await Product.create({
        _id: productId,
        photos: imgArray,
        ...fields,
      });

      if (!product) {
        throw new CustomError("Product was not created", 400);
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "something went wrong",
      });
    }
  });
});
