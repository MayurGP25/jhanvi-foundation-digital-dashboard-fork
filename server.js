const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes"); // include beneficiary routes
const { requireLogin } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session
app.use(session({
    secret: "jhanavi_foundation_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Landing Page
app.get("/", (req, res) => res.render("index"));

// Dashboard
app.get("/dashboard", requireLogin, (req, res) => {
    res.render("dashboard", { user: req.session.user });
});

// Route modules
app.use("/", authRoutes);                    // login/signup/logout
app.use("/beneficiaries", beneficiaryRoutes); // menu, add, view, edit

// Server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
