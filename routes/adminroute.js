import { Router } from "express";
const adminRoute = Router();
import {
  loadLogin,
  adminPanel,
  loadDashboard,
  adminlogout,
  userManagement,
  searchUser,
  useraction,
  loadorders,
  loadorderdetails,
  OrderStatusupdate,
  salesReportpage,
  generateSalesReport,
  getSalesData,
  getSalesDataWeekly,
  getSalesDataYearly,
  manageCoupons,
  addCoupon,
  insertCoupon,
} from "../controllers/admincontroller.js";
import {
  addProduct,
  insertProduct,
  productManagement,
  listProduct,
  unListProduct,
  editProductPage,
  updateProduct,
} from "../controllers/productControl.js";
import { isLogout, isLogin } from "../middleware/adminAuth.js";
import {
  categoryManagement,
  addCategory,
  insertCategory,
  list,
  unList,
  editCategory,
  updateCategory,
  searchCategory,
} from "../controllers/categoryControl.js";
import { upload } from "../config/upload.js";
import {
  banner_get,
  newBanner_get,
  newBanner_post,
  bannerEdit_get,
  bannerEdit_post,
  bannerDelete_get,
} from "../controllers/bannerController.js";

import dotenv from "dotenv";
dotenv.config();

adminRoute.use((req, res, next) => {
  req.app.set("layout", "admin/layout/admin");
  next();
});

adminRoute.get("/", isLogout, loadLogin);
adminRoute.post("/", adminPanel);

adminRoute.get("/dashboard", loadDashboard);
adminRoute.get("/logout", isLogin, adminlogout);

//USER MANAGEMENT

adminRoute.get("/user", isLogin, userManagement);
adminRoute.post("/user", isLogin, searchUser);
adminRoute.get("/useractions", isLogin, useraction);

// categoryManagement---
adminRoute.get("/category", isLogin, categoryManagement);
adminRoute.get("/addCategory", isLogin, addCategory);
adminRoute.post("/addCategory", isLogin, insertCategory);
adminRoute.get("/category/list/:id", isLogin, list);
adminRoute.get("/category/unList/:id", isLogin, unList);
adminRoute.get("/editCategory/:id", isLogin, editCategory);
adminRoute.post("/editCategory/:id", isLogin, updateCategory);
adminRoute.post("/category/search", isLogin, searchCategory);

// Product Management---
adminRoute.get("/product/addProduct", isLogin, addProduct);

adminRoute.post(
  "/product/addProduct",
  upload.fields([
    { name: "secondaryImage", maxCount: 3 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  insertProduct
); /** Product adding and multer using  **/

adminRoute.get("/product", isLogin, productManagement);
adminRoute.post("/product/list/:id", isLogin, listProduct);
adminRoute.post("/product/unList/:id", isLogin, unListProduct);
adminRoute.get("/product/editproduct/:id", isLogin, editProductPage);
adminRoute.post(
  "/product/editproduct/:id",
  upload.fields([
    { name: "secondaryImage", maxCount: 3 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  updateProduct
);

// order
adminRoute.get("/orders", isLogin, loadorders);
adminRoute.get("/orderdetails/:id", isLogin, loadorderdetails);
adminRoute.post("/orderdetails/update/:id", isLogin, OrderStatusupdate);

//salesreport
adminRoute.get("/salesreport", isLogin, salesReportpage);
adminRoute.get("/get/sales-report", isLogin, generateSalesReport);
adminRoute.get("/sales-data", isLogin, getSalesData);
adminRoute.get("/sales-data/weekly", isLogin, getSalesDataWeekly);
adminRoute.get("/sales-data/yearly", isLogin, getSalesDataYearly);

//Manage Coupons
adminRoute.get("/manageCoupons/:page", isLogin, manageCoupons);
adminRoute.get("/addCoupon", isLogin, addCoupon);
adminRoute.post("/addCoupon", isLogin, insertCoupon);

//<!--BnnerManagement-->
adminRoute.get("/manageBanner", banner_get);
adminRoute.get("/banner/newBanner", newBanner_get);
adminRoute.post(
  "/banner/newBanner",
  upload.fields([{ name: "bannerImage" }]),
  newBanner_post
);
adminRoute.get("/banner/editBanner/:bannerId", bannerEdit_get);
adminRoute.post(
  "/banner/editBanner",
  upload.fields([{ name: "bannerImage" }]),
  bannerEdit_post
);
adminRoute.get("/banner/deleteBanner/:id", bannerDelete_get);

export default adminRoute;
