import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import userRoute from "./routes/userroute.js";
import adminRoute from "./routes/adminroute.js";
import dbConnect from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 8000;

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use("/admin", express.static(path.join(__dirname, "public")));
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
