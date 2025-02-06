import express from "express";
const { urlencoded, json } = express;
const staticMiddleware = express.static;
const app = express();
const PORT = 8000;
import userRoute from "./routes/userroute";
import expressLayout from "express-ejs-layouts";
import adminRoute from "./routes/adminroute";
import { dbConnect } from "./config/database";
require("dotenv").config();
import flash from "connect-flash";
import session from "express-session";

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(urlencoded({ extended: true }));
app.use(json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(staticMiddleware("public"));
app.use("/admin", staticMiddleware(__dirname + "/public"));
app.use(expressLayout);
// res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
// app.use(nocache);
dbConnect();

app.use(
  session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: true,
    cookies: {
      httponly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/admin", adminRoute);
app.use("/", userRoute);

// 404 Error Handler
app.use((req, res, next) => {
  // For admin routes
  if (req.url.startsWith("/admin")) {
    res.status(404).render("./admin/pages/404", {
      title: "404",
      includeHeaderFooter: false,
    });
  }
  // For user routes
  else {
    res.status(404).render("./user/pages/404", {
      title: "404 Not Found",
      includeHeaderFooter: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running succesfully on ${PORT}`);
});
