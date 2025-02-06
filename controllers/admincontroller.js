import {
  countDocuments,
  findOne,
  find,
  findById,
} from "../models/userModels.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  find as _find,
  aggregate,
  countDocuments as _countDocuments,
  findById as _findById,
  findByIdAndUpdate,
} from "../models/orderModel.js";
import Address from "../models/addressModel.js";
import numeral from "numeral";
import moment from "moment";
import Product from "../models/productModel.js";
import {
  find as __find,
  countDocuments as __countDocuments,
  findOne as _findOne,
  create,
} from "../models/couponModel.js";

const loadLogin = async (req, res) => {
  try {
    res.render("./admin/pages/acclogin", { title: "Login" });
  } catch (error) {
    throw new Error(error);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const user = req?.user;
    const recentOrders = await _find()
      .limit(5)
      .populate({
        path: "user",
        select: "username",
      })

      .select("orderDate grandTotal")
      .sort({ _id: -1 });

    let totalSalesAmount = 0;

    recentOrders.forEach((order) => {
      totalSalesAmount += order.grandTotal;
    });

    totalSalesAmount = numeral(totalSalesAmount).format("0.0a");
    const totalSoldProducts = await aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          total_sold_count: {
            $sum: "$products.quantity",
          },
        },
      },
    ]);

    const totalOrderCount = await _countDocuments();
    const totalActiveUserCount = await countDocuments();

    res.render("./admin/pages/index", {
      title: "Dashboard",
      user,
      recentOrders,
      totalOrderCount,
      totalActiveUserCount,
      totalSalesAmount,
      moment,
      totalSoldProducts: totalSoldProducts[0].total_sold_count,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const loadproductlist = async (req, res) => {
  try {
    res.render("./admin/pages/productlist", { title: "Product" });
  } catch (error) {
    throw new Error(error);
  }
};

const loadorders = async (req, res) => {
  try {
    const pageSize = 10;
    const currentPage = parseInt(req.query.page) || 1;

    const totalOrders = await _countDocuments();
    const totalPages = Math.ceil(totalOrders / pageSize);

    const orders = await _find()
      .populate("address")
      .sort({ orderDate: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);
    res.render("./admin/pages/orders", {
      title: "order",
      orders,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadorderdetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await _findById(orderId)
      .populate("address")
      .populate("products.product")
      .populate("user");
    if (!order) {
      return res.status(404).render("./admin/pages/404", { title: "404" });
    }
    res.render("./admin/pages/orderdetails", { title: "order", order });
  } catch (error) {
    console.error(error);
    res.status(404).render("./admin/pages/404", { title: "404" });
  }
};

const OrderStatusupdate = async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  try {
    const order = await findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );
    res.redirect(`/admin/orderdetails/${orderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Login
const adminPanel = async (req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const emailCheck = req.body.email;

    const user = await findOne({ email: emailCheck });

    if (user) {
      res.render("./admin/pages/acclogin", {
        adminCheck: "You are not an Admin",
        title: "Login",
      });
    }
    if (emailCheck === email && req.body.password === password) {
      req.session.admin = email;
      res.redirect("/admin/dashboard");
    } else {
      res.render("./admin/pages/acclogin", {
        adminCheck: "Invalid Credentials",
        title: "Login",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

//USER MANAGEMENT
const userManagement = async (req, res) => {
  try {
    const findUsers = await find();

    res.render("./admin/pages/userList", {
      users: findUsers,
      title: "UserList",
    });
  } catch (error) {
    throw new Error(error);
  }
};

// searchUser
const searchUser = async (req, res) => {
  try {
    const data = req.body.search;
    const searching = await find({
      userName: { $regex: data, $options: "i" },
    });
    if (searching) {
      res.render("./admin/pages/userList", {
        users: searching,
        title: "Search",
      });
    } else {
      res.render("./admin/pages/userList", { title: "Search" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const useraction = async (req, res) => {
  const userID = req.query.id;
  const action = req.query.action;
  try {
    const user = await findById(userID);
    if (!user) {
      return res.status(400).send("user not found");
    }
    if (action === "block") {
      user.isBLock = true;
    } else if (action === "unblock") {
      user.isBLock = false;
    }
    await user.save();
    res.redirect("/admin/user");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

//salesreport
const salesReportpage = async (req, res) => {
  try {
    res.render("admin/pages/salesreport", { title: "Sales Report" });
  } catch (error) {
    throw new Error(error);
  }
};

const generateSalesReport = async (req, res, next) => {
  try {
    const fromDate = new Date(req.query.fromDate);
    const toDate = new Date(req.query.toDate);

    const deliveryStatus = "Delivered";

    const salesData = await _find({
      orderDate: {
        $gte: fromDate,
        $lte: toDate,
      },
      status: deliveryStatus,
    }).select("_id grandTotal orderDate paymentMethod");

    const formattedSalesData = salesData.map((order) => ({
      orderId: order._id,
      grandTotal: order.grandTotal,
      orderDate: order.orderDate.toLocaleDateString(),
      paymentMethod: order.paymentMethod,
    }));

    res.status(200).json(formattedSalesData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get sales data monthly
const getSalesData = async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          year: { $year: "$orderDate" },
          month: { $month: "$orderDate" },
          totalSales: "$grandTotal",
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.month", 10] },
                  then: { $concat: ["0", { $toString: "$_id.month" }] },
                  else: { $toString: "$_id.month" },
                },
              },
            ],
          },
          sales: "$sales",
        },
      },
    ];

    const monthlySalesArray = await aggregate(pipeline);
    console.log(monthlySalesArray);

    res.json(monthlySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get sales data yearly
const getSalesDataYearly = async (req, res) => {
  try {
    const yearlyPipeline = [
      {
        $project: {
          year: { $year: "$orderDate" },
          totalSales: "$grandTotal",
        },
      },
      {
        $group: {
          _id: { year: "$year" },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          year: { $toString: "$_id.year" },
          sales: "$sales",
        },
      },
    ];

    const yearlySalesArray = await aggregate(yearlyPipeline);
    res.json(yearlySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get sales data weekly
const getSalesDataWeekly = async (req, res) => {
  try {
    const weeklySalesPipeline = [
      {
        $project: {
          week: { $week: "$orderDate" },
          totalSales: "$grandTotal",
        },
      },
      {
        $group: {
          _id: { week: { $mod: ["$week", 7] } },
          sales: { $sum: "$totalSales" },
        },
      },
      {
        $project: {
          _id: 0,
          week: { $toString: "$_id.week" },
          dayOfWeek: { $add: ["$_id.week", 1] },
          sales: "$sales",
        },
      },
      {
        $sort: { dayOfWeek: 1 },
      },
    ];

    const weeklySalesArray = await aggregate(weeklySalesPipeline);
    console.log(weeklySalesArray);

    res.json(weeklySalesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// logout
const adminlogout = async (req, res) => {
  try {
    res.redirect("/admin");
  } catch (error) {
    res.status(404).render("./admin/pages/404");
  }
};

//Manage Coupons
const manageCoupons = async (req, res) => {
  let page = parseInt(req.params.page) || 1;
  let perPage = 5;
  let allCoupons = await __find({})
    .skip((page - 1) * perPage)
    .limit(perPage);
  let totalCoupons = await __countDocuments({});
  let totalPages = Math.ceil(totalCoupons / perPage);
  allCoupons.forEach((coupon) => {
    coupon.expiredOn = convertDateAndTime(coupon.expiryDate);
  });
  res.render("./admin/pages/manageCoupons", {
    title: "Coupon Management",
    coupons: allCoupons,
    totalPages,
    currentPage: page,
  });
  res.end();
};

const addCoupon = async (req, res) => {
  res.render("./admin/pages/addCoupon", { title: "Add New Coupon" });
  res.end();
};

const insertCoupon = async (req, res) => {
  const couponName = req.body.couponName;
  const existingCoupon = await _findOne({ couponName });

  if (existingCoupon) {
    return res.render("./admin/pages/addCoupon", {
      title: "Add New Coupon",
      alert: "Coupon '" + couponName + "' already exists.",
    });
  }

  await create(req.body);
  res.render("./admin/pages/addCoupon", {
    title: "Add New Coupon",
    alert: "New coupon " + req.body.couponName + " added.",
  });
  res.end();
};

//functions
function convertDateAndTime(dateString) {
  console.log("converting date string : ", dateString);
  let dateObject = new Date(dateString);

  let dayOfWeek = dateObject.getDay();
  // Convert to a custom date string format
  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let day = dateObject.toLocaleString("en-US", options);

  // Convert time to Indian Standard Time (IST)
  options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Kolkata",
  };
  let time = dateObject.toLocaleString("en-US", options);

  return { day, time, dayOfWeek, dateString };
}

export default {
  loadDashboard,
  loadproductlist,
  loadorders,
  loadLogin,
  adminPanel,
  userManagement,
  searchUser,
  useraction,
  adminlogout,
  loadorderdetails,
  OrderStatusupdate,
  salesReportpage,
  generateSalesReport,
  getSalesData,
  getSalesDataYearly,
  getSalesDataWeekly,
  manageCoupons,
  addCoupon,
  insertCoupon,
};
