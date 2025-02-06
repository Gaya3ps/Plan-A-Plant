import Product, {
  find,
  findByIdAndUpdate,
  findById,
} from "../models/productModel.js";
import { find as _find, findById as _findById } from "../models/categoryModel.js";
import fs from "fs";
import expressHandler from "express-async-handler";
import { upload } from "../config/upload.js";
import sharp from "sharp";
import { join } from "path";
import mongoose from "mongoose";

// productManagement
const productManagement = expressHandler(async (req, res) => {
  try {
    const findProduct = await find().populate("categoryName");
    res.render("./admin/pages/productlist", {
      title: "Products",
      productList: findProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// addProduct Page
const addProduct = expressHandler(async (req, res) => {
  try {
    const category = await _find({ isListed: true });
    if (category) {
      res.render("./admin/pages/addProduct", {
        title: "addProduct",
        catList: category,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const insertProduct = expressHandler(async (req, res) => {
  try {
    let primaryImage = [];
    req.files.primaryImage.forEach((e) => {
      primaryImage.push({
        name: e.filename,
        path: e.path,
      });
    });

    const secondaryImages = [];
    for (const e of req.files.secondaryImage) {
      const croppedImage = join(
        __dirname,
        "../public/admin/uploads",
        `cropped_${e.filename}`
      );

      await sharp(e.path)
        .resize(600, 600, { fit: "cover" })
        .toFile(croppedImage);

      secondaryImages.push({
        name: `cropped_${e.filename}`,
        path: croppedImage,
      });
    }
    const { offer, productPrice, categoryName } = req.body;

    const filteredCategory = await _findById({ _id: categoryName });

    if (
      filteredCategory.categoryOffer > 0 &&
      filteredCategory.categoryOffer > offer
    ) {
      offerPrice = (productPrice * filteredCategory.categoryOffer) / 100;
      console.log(offerPrice);
      discountAmount = productPrice - offerPrice;
      console.log(discountAmount);
    } else {
      offerPrice = (productPrice * offer) / 100;
      console.log(offerPrice);
      discountAmount = productPrice - offerPrice;
      console.log(discountAmount);
    }

    let salePrice = discountAmount;

    const saving = new Product({
      title: req.body.title,
      size: req.body.size,
      description: req.body.description,
      categoryName: req.body.categoryName,
      quantity: req.body.quantity,
      salePrice: salePrice,
      productPrice: req.body.productPrice,
      offer: req.body.offer,
      primaryImage: primaryImage,
      secondaryImages: secondaryImages,
    });

    const inserted = await saving.save();

    if (inserted) {
      return res.redirect("/admin/product");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// ListProduct
const listProduct = expressHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await findByIdAndUpdate(
      { _id: id },
      { $set: { isListed: true } }
    );

    res.redirect("/admin/product");
  } catch (error) {
    throw new Error(error);
  }
});

// unlist product
const unListProduct = expressHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await findByIdAndUpdate(
      { _id: id },
      { $set: { isListed: false } }
    );
    res.redirect("/admin/product");
  } catch (error) {
    throw new Error(error);
  }
});

// editProductPage Loading
const editProductPage = expressHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const category = await _find({ isListed: true });
    const productFound = await findById(id).populate("categoryName").exec();

    if (productFound) {
      res.render("./admin/pages/editProduct", {
        title: "editProduct",
        product: productFound,
        catList: category,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const updateProduct = expressHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const existingProduct = await findById(id);

    let primaryImage;
    if (req.files.primaryImage) {
      const primaryImageFile = req.files.primaryImage[0];
      primaryImage = {
        name: primaryImageFile.filename,
        path: primaryImageFile.path,
      };
    } else {
      primaryImage = existingProduct.primaryImage[0];
    }

    const deleteSecondaryImages = req.body.deleteSecondaryImage;
    const dbImage = [];

    existingProduct.secondaryImages.forEach((image, index) => {
      if (
        !deleteSecondaryImages ||
        !deleteSecondaryImages.includes(index.toString())
      ) {
        dbImage.push({
          name: image.name,
          path: image.path,
        });
      }
    });

    const secondaryImages = req.files.secondaryImage;

    if (secondaryImages) {
      secondaryImages.forEach((image) => {
        dbImage.push({
          name: image.filename,
          path: image.path,
        });
      });
    }

    // Save the updated product back to the database
    existingProduct.primaryImage = [primaryImage];
    existingProduct.secondaryImages = dbImage;
    await existingProduct.save();

    let discountAmount = 0;
    const productPrice = req.body.productPrice;
    const offerPercentage = req.body.offer;
    discountAmount = Math.floor((productPrice * offerPercentage) / 100);
    let salePrice = productPrice - discountAmount;

    const editingProduct = {
      title: req.body.title,
      description: req.body.description,
      categoryName: req.body.categoryName,
      quantity: req.body.quantity,
      productPrice: req.body.productPrice,
      salePrice: salePrice,
      primaryImage: [primaryImage],
      secondaryImages: dbImage,
      offer: req.body.offer,
    };

    const updatedProduct = await findByIdAndUpdate(id, editingProduct, {
      new: true,
    });

    res.redirect("/admin/product");
  } catch (error) {
    throw new Error(error);
  }
});

export default {
  addProduct,
  insertProduct,
  productManagement,
  listProduct,
  unListProduct,
  editProductPage,
  updateProduct,
};
