const bcrypt = require("bcrypt");
const db = require("../config/db");

// Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
            email, hashed
        ]);
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.send("Signup error: email may already exist");
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.send("No user found.");

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.send("Invalid credentials.");

        req.session.user = { id: user.id, email: user.email };
        res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Login error.");
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.clearCookie("connect.sid"); // clear session cookie
        res.redirect("/login"); // redirect to login page
    });
};
