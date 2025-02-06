const mongoose = require("mongoose");
const User = require("../models/userModels.js");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Category = require("../models/categoryModel");
const Banner = require("../models/bannerModel");
const asyncHandler = require("express-async-handler");
const {
  sendOtp,
  generateOTP,
  sendVerifymail,
} = require("../helper/nodemailer.js");

const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const loadlandingpage = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    const getalldata = await Product.find();
    const allBanner = await Banner.find({ status: "active" });
    res.render("./user/pages/index", { getalldata, user, allBanner });
  } catch (error) {
    throw new Error(error);
  }
};

const loaduserprofile = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);

    res.render("./user/pages/userprofile", { user });
  } catch (error) {
    throw new Error(error);
  }
};

async function editProfilePost(req, res) {
  const userId = req.session.user_id;
  const user = await User.findOne({ _id: userId });

  const newuserName = req.body.username;
  const newEmail = req.body.email;
  const newMobile = req.body.mobile;

  user.username = newuserName;
  user.email = newEmail;
  user.mobile = newMobile;
  await user.save();

  res.redirect("/userprofile");
}

const loadloginpage = async (req, res) => {
  try {
    const user = req.session.user_id;

    res.render("./user/pages/login", { user });
  } catch (error) {
    throw new Error(error);
  }
};

const loadregistration = async (req, res) => {
  try {
    const user = req.session.user_id;
    res.render("./user/pages/registration", { user });
  } catch (error) {
    throw new Error(error);
  }
};

const loadaboutpage = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await User.findById(userId);
    res.render("./user/pages/about", { user });
  } catch (error) {
    throw new Error(error);
  }
};

const loadcontactpage = async (req, res) => {
  try {
    const user = req.session.user_id;

    res.render("./user/pages/contact", { user });
  } catch (error) {
    throw new Error(error);
  }
};

const loadshoppage = async (req, res) => {
  try {
    const priceRange = req.query.priceRange || "all";
    const sortBy = req.query.sortBy || "priceLowToHigh";
    const page = req.query.p || 1;
    const search = req.query.search || "";

    const listedCategories = await Category.find({ isListed: true });
    const categoryMapping = {};

    listedCategories.forEach((category) => {
      categoryMapping[category.categoryName] = category._id;
    });

    const catfilter = { isListed: true };
    if (req.query.category) {
      if (categoryMapping.hasOwnProperty(req.query.category)) {
        catfilter.categoryName = categoryMapping[req.query.category];
      } else {
        return res.status(404).send("Category not found");
      }
    }

    let minPrice = 0;
    let maxPrice = Number.MAX_VALUE;
    switch (priceRange) {
      case "0-200":
        minPrice = 0;
        maxPrice = 200;
        break;
      case "200-500":
        minPrice = 200;
        maxPrice = 500;
        break;
      case "500-1000":
        minPrice = 500;
        maxPrice = 1000;
        break;
      case "1000-2000":
        minPrice = 1000;
        maxPrice = 2000;
        break;
      case "2000+":
        minPrice = 2000;
        break;
      default:
        break;
    }

    let sortQuery = {};
    if (sortBy === "priceLowToHigh") {
      sortQuery = { salePrice: 1 };
    } else if (sortBy === "priceHighToLow") {
      sortQuery = { salePrice: -1 };
    }

    const filter = { salePrice: { $gte: minPrice, $lte: maxPrice } };
    const searchFilter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const totalProducts = await Product.find({
      ...filter,
      ...catfilter,
      ...searchFilter,
    }).countDocuments();

    const products = await Product.find({
      ...filter,
      ...catfilter,
      ...searchFilter,
    }).sort(sortQuery);
    const getalldata = await Product.find();

    const user = await User.findById(req.session.user_id);

    res.render("./user/pages/shop", {
      getalldata,
      product: products,
      sortBy,
      priceRange,
      search,
      user,
      currentPage: page,
      totalProducts,
      categories: listedCategories,
      selectedCategory: catfilter.categoryName || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const loadproductdetail = async (req, res) => {
  try {
    const productId = req.query.id;
    const userId = req.session.user_id;
    const user = await User.findById(userId);

    const getalldata = await Product.findById(productId);
    if (!getalldata) {
      return res
        .status(404)
        .render("./user/pages/404", { title: "404 Not Found" });
    }

    res.render("./user/pages/productdetail", { getalldata, user });
  } catch (error) {
    console.error(error);
    res.status(404).render("./user/pages/404", { title: "404 Not Found" });
  }
};

// inserting User
const register = async (req, res) => {
  try {
    const emailCheck = req.body.email;
    const checkData = await User.findOne({ email: emailCheck });
    if (checkData) {
      const user = req.session.user_id;

      return res.render("./user/pages/registration", {
        userCheck: "User already exists, please try with a new email",
        user,
      });
    } else {
      const UserData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };

      const OTP = generateOTP();

      req.session.otpUser = { ...UserData, otp: OTP };
      console.log(req.session.otpUser.otp);

      //  otp sending
      try {
        sendOtp(req.body.email, OTP, req.body.username);
        return res.redirect("/otp");
      } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).send("Error sending OTP");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

//OTP Section

// loadSentOTP
const sendOTPpage = async (req, res) => {
  try {
    const email = req.session.otpUser;
    const user = req.session.user_id;

    res.render("./user/pages/otpVerification", { user });
  } catch (error) {
    throw new Error(error);
  }
};

//verify otp
const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const enteredOTP = req.body.otp;
    const email = req.session.otpUser.email;
    const storedOTP = req.session.otpUser.otp;
    const user = req.session.otpUser;
    let messages = "";

    if (enteredOTP == storedOTP) {
      user.password = await bcrypt.hash(user.password, 10);
      const newUser = await User.create(user);
      delete req.session.otpUser.otp;
      res.redirect("/login");
    } else {
      const errorMessage =
        "Verification failed, please check the OTP or resend it.";
      console.log("verification failed");
      const user = req.session.user_id;

      res.render("./user/pages/otpVerification", { errorMessage, email, user });
    }
  } catch (error) {
    throw new Error(error);
  }
});

//resending otp
const reSendOTP = async (req, res) => {
  try {
    const OTP = generateOTP();
    console.log(OTP);
    req.session.otpUser.otp = { otp: OTP };
    const email = req.session.otpUser.email;
    const username = req.session.otpUser.username;

    // otp resending
    try {
      sendOtp(email, OTP, username);
      console.log("otp is sent");
      const user = req.session.user_id;

      return res.render("./user/pages/reSendOTP", { email, user });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).send("Error sending OTP");
    }
  } catch (error) {
    throw new Error(error);
  }
};

//verify resend otp
const verifyResendOTP = asyncHandler(async (req, res) => {
  try {
    const enteredOTP = req.body.otp;
    const storedOTP = req.session.otpUser.otp;

    const user = req.session.otpUser;

    if (enteredOTP == storedOTP.otp) {
      user.password = await bcrypt.hash(user.password, 10);
      const newUser = await User.create(user);
      if (newUser) {
        console.log("new user insert in resend page", newUser);
      } else {
        console.log("error in insert user");
      }
      delete req.session.otpUser.otp;
      res.redirect("/login");
    } else {
      console.log("verification failed");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// forgetpassword
const forgetLoad = async (req, res) => {
  try {
    res.render("./user/pages/forgetpassword");
  } catch (error) {
    throw new Error(error);
  }
};

//reset pswd postemail
const forgetpswd = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const randomString = randomstring.generate();
      const updateData = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendVerifymail(user.username, user.email, randomString);
      res.render("./user/pages/forgetpassword", {
        message: "Please check your mail to reset your password",
      });
    } else {
      res.render("./user/pages/forgetpassword", {
        message: "user email is incorrect",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

//forget pswd page get
const forgetPswdload = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("./user/pages/forget-password", { user_id: tokenData._id });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//forget pswd post
const resetPswd = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const secure_password = await securePassword(password);

    const updateData = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: secure_password, token: "" } }
    );
    res.render("./user/pages/login", {
      message: "password reset successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
};

// LOGIN PAGE
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const allBanner = await Banner.find({ status: "active" });
    const user = await User.findOne({ email });

    if (!user) {
      const errorMessage = "Invalid username or password";
      return res.render("user/pages/login", { errorMessage, allBanner });
    }

    if (user.isBLock) {
      const errorMessage = "User is blocked. Please contact support.";
      return res.render("user/pages/login", { errorMessage, allBanner });
    }
    if (user && user.isBLock) {
      req.session.user._id = null;
      res.redirect("/");
    }

    const passwordMatch = await user.verifyPassword(password);

    if (!passwordMatch) {
      const errorMessage = "Invalid password";
      return res.render("user/pages/login", { errorMessage, allBanner });
    }

    req.session.user_id = user._id;
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("error-page", { error: "An error occurred" });
  }
};

// User Logout--
const userlogout = async (req, res) => {
  try {
    req.session.user_id = null;
    res.redirect("/");
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  loadloginpage,
  loadregistration,
  loadaboutpage,
  loadcontactpage,
  loadshoppage,
  loadlandingpage,
  loadproductdetail,
  register,
  sendOTPpage,
  verifyOTP,
  login,
  verifyOTP,
  reSendOTP,
  verifyResendOTP,
  userlogout,
  loaduserprofile,
  editProfilePost,
  forgetLoad,
  forgetpswd,
  forgetPswdload,
  resetPswd,
};
