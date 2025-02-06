import express from "express";
import productController from "../controllers/productControl.js";
import adminAuth from "../middleware/adminAuth.js";
import categoryController from "../controllers/categoryControl.js";
import upload from "../config/upload.js";
import bannerController from "../controllers/bannerController.js";
import dotenv from "dotenv";
import admincontroller from "../controllers/admincontroller.js"

dotenv.config();

const adminRoute = express.Router();

adminRoute.use((req, res, next) => {
  req.app.set("layout", "admin/layout/admin");
  next();
});

adminRoute.get("/", adminAuth.isLogout, admincontroller.loadLogin);
adminRoute.post("/", admincontroller.adminPanel);

adminRoute.get("/dashboard", admincontroller.loadDashboard);
adminRoute.get("/logout", adminAuth.isLogin, admincontroller.adminlogout);

//USER MANAGEMENT

adminRoute.get("/user", adminAuth.isLogin, admincontroller.userManagement);
adminRoute.post("/user", adminAuth.isLogin, admincontroller.searchUser);
adminRoute.get("/useractions", adminAuth.isLogin, admincontroller.useraction);

// categoryManagement---
adminRoute.get(
  "/category",
  adminAuth.isLogin,
  categoryController.categoryManagement
);
adminRoute.get(
  "/addCategory",
  adminAuth.isLogin,
  categoryController.addCategory
);
adminRoute.post(
  "/addCategory",
  adminAuth.isLogin,
  categoryController.insertCategory
);
adminRoute.get(
  "/category/list/:id",
  adminAuth.isLogin,
  categoryController.list
);
adminRoute.get(
  "/category/unList/:id",
  adminAuth.isLogin,
  categoryController.unList
);
adminRoute.get(
  "/editCategory/:id",
  adminAuth.isLogin,
  categoryController.editCategory
);
adminRoute.post(
  "/editCategory/:id",
  adminAuth.isLogin,
  categoryController.updateCategory
);
adminRoute.post(
  "/category/search",
  adminAuth.isLogin,
  categoryController.searchCategory
);

// Product Management---
adminRoute.get(
  "/product/addProduct",
  adminAuth.isLogin,
  productController.addProduct
);

adminRoute.post(
  "/product/addProduct",
  upload.fields([
    { name: "secondaryImage", maxCount: 3 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  productController.insertProduct
); /** Product adding and multer using  **/

adminRoute.get(
  "/product",
  adminAuth.isLogin,
  productController.productManagement
);
adminRoute.post(
  "/product/list/:id",
  adminAuth.isLogin,
  productController.listProduct
);
adminRoute.post(
  "/product/unList/:id",
  adminAuth.isLogin,
  productController.unListProduct
);
adminRoute.get(
  "/product/editproduct/:id",
  adminAuth.isLogin,
  productController.editProductPage
);
adminRoute.post(
  "/product/editproduct/:id",
  upload.fields([
    { name: "secondaryImage", maxCount: 3 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  productController.updateProduct
);

// order
adminRoute.get("/orders", adminAuth.isLogin, admincontroller.loadorders);
adminRoute.get(
  "/orderdetails/:id",
  adminAuth.isLogin,
  admincontroller.loadorderdetails
);
adminRoute.post(
  "/orderdetails/update/:id",
  adminAuth.isLogin,
  admincontroller.OrderStatusupdate
);

//salesreport
adminRoute.get(
  "/salesreport",
  adminAuth.isLogin,
  admincontroller.salesReportpage
);
adminRoute.get(
  "/get/sales-report",
  adminAuth.isLogin,
  admincontroller.generateSalesReport
);
adminRoute.get("/sales-data", adminAuth.isLogin, admincontroller.getSalesData);
adminRoute.get(
  "/sales-data/weekly",
  adminAuth.isLogin,
  admincontroller.getSalesDataWeekly
);
adminRoute.get(
  "/sales-data/yearly",
  adminAuth.isLogin,
  admincontroller.getSalesDataYearly
);

//Manage Coupons
adminRoute.get(
  "/manageCoupons/:page",
  adminAuth.isLogin,
  admincontroller.manageCoupons
);
adminRoute.get("/addCoupon", adminAuth.isLogin, admincontroller.addCoupon);
adminRoute.post("/addCoupon", adminAuth.isLogin, admincontroller.insertCoupon);

//<!--BnnerManagement-->
adminRoute.get("/manageBanner", bannerController.banner_get);
adminRoute.get("/banner/newBanner", bannerController.newBanner_get);
adminRoute.post(
  "/banner/newBanner",
  upload.fields([{ name: "bannerImage" }]),
  bannerController.newBanner_post
);
adminRoute.get("/banner/editBanner/:bannerId", bannerController.bannerEdit_get);
adminRoute.post(
  "/banner/editBanner",
  upload.fields([{ name: "bannerImage" }]),
  bannerController.bannerEdit_post
);
adminRoute.get("/banner/deleteBanner/:id", bannerController.bannerDelete_get);

export default adminRoute;
