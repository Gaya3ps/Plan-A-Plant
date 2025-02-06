import { Router } from "express";
const userRoute = Router();
import { loadregistration, register, login, loadaboutpage, loadshoppage, loadcontactpage, loadloginpage, loadlandingpage, loadproductdetail, loaduserprofile, editProfilePost, forgetLoad, forgetpswd, forgetPswdload, resetPswd, sendOTPpage, verifyOTP, reSendOTP, verifyResendOTP, userlogout } from "../controllers/usercontroller";
import { getAllAddress, addAddressPage, newAddress, editAddressPage, editAddress, deleteAddress } from "../controllers/addressController";
import { isLogout, isLogin } from "../middleware/userAuth";
import setErrorMessage from "../middleware/errormsg";
import { loadshopcartpage, addToCart, removeProduct, updateCart, loadCheckOutpage } from "../controllers/cartController";
import { confirmOrder, loadOrderList, loadorderDetailing, verifyPayment, cancelOrder, cancelOrderById, returnOrderById, acceptReturn, rejectReturn, addToWallet, loadWallet } from "../controllers/orderControl";
import { generateInvoicePdf } from "../helper/pdfGenerator";

userRoute.use(setErrorMessage);

userRoute.use((req, res, next) => {
  req.app.set("layout", "user/layout/user");

  next();
});

// userRoute.get('/',usercontroller.loadlandingpage)
// userRoute.get('/login',usercontroller.loadloginpage);

userRoute.get("/registration", loadregistration);

userRoute.post("/registration", register);
userRoute.post("/login", login);
userRoute.get("/about", loadaboutpage);
userRoute.get("/shop", loadshoppage);
// userRoute.get('/shopingcart',userAuth.isLogin,usercontroller.loadshopcartpage);
userRoute.get("/contact", loadcontactpage);
userRoute.get("/login", isLogout, loadloginpage);
userRoute.get("/", loadlandingpage);
userRoute.get("/product", loadproductdetail);
userRoute.get("/userprofile", isLogin, loaduserprofile);
userRoute.post(
  "/userprofile",
  isLogin,
  editProfilePost
);

// resetpassword
userRoute.get("/forget", isLogout, forgetLoad);
userRoute.post("/forget", isLogout, forgetpswd);
userRoute.get(
  "/forget-password",
  isLogout,
  forgetPswdload
);
userRoute.post("/forget-password", isLogout, resetPswd);

userRoute.get("/otp", isLogout, sendOTPpage);
userRoute.post("/otp", verifyOTP);
// userRoute.post('/otp',usercontroller.verifyOTP);
userRoute.get("/reSendOTP", reSendOTP);
userRoute.post("/reSendOTP", verifyResendOTP);
userRoute.get("/logout", isLogin, userlogout);

//ADDRESS
userRoute.get("/address", isLogin, getAllAddress);
userRoute.get(
  "/addAddress",
  isLogin,
  addAddressPage
);
userRoute.post("/addAddress", isLogin, newAddress);
userRoute.get(
  "/editAddress",
  isLogin,
  editAddressPage
);
userRoute.post("/editAddress", isLogin, editAddress);
userRoute.get(
  "/deleteAddress/:id",
  isLogin,
  deleteAddress
);

// Add to Cart
userRoute.get(
  "/shopingcart",
  isLogin,
  loadshopcartpage
);
userRoute.post("/shopingcart",isLogin, addToCart);
userRoute.get("/removecart",isLogin, removeProduct);

//update cart
userRoute.post("/updateCart", isLogin, updateCart);

//checkOut
userRoute.get("/checkOut", isLogin, loadCheckOutpage);
userRoute.post(
  "/confirm-order",
  isLogin,
  confirmOrder
);
userRoute.get("/orderList", isLogin, loadOrderList);
userRoute.get("/orderDetailing", loadorderDetailing);
userRoute.get("/invoice", generateInvoicePdf);
userRoute.post(
  "/verify-payment",
  isLogin,
  verifyPayment
);
// order
userRoute.get("/cancelOrder/:id", cancelOrder);
userRoute.post("/cancelSingleOrder", cancelOrderById);
userRoute.post("/requestReturn", returnOrderById);
userRoute.post("/acceptReturn/:id", acceptReturn);
userRoute.post("/rejectReturn/:id", rejectReturn);



userRoute.post("/addToWallet", isLogin, addToWallet);

//load wallet page
userRoute.get("/wallet", isLogin, loadWallet);

export default userRoute;
