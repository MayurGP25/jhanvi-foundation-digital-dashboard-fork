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

// Direct password reset from login popup (username/email + new password)
exports.directPasswordReset = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!email || !password || !confirmPassword) {
            return res.redirect(`/login?message=${encodeURIComponent("All fields are required.")}&type=danger`);
        }
        if (password !== confirmPassword) {
            return res.redirect(`/login?message=${encodeURIComponent("Passwords do not match.")}&type=danger`);
        }

        const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.redirect(`/login?message=${encodeURIComponent("No user found with that email.")}&type=danger`);
        }

        const hashed = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);
        return res.redirect(`/login?message=${encodeURIComponent("Password updated. Please login.")}&type=success`);
    } catch (err) {
        console.error(err);
        return res.redirect(`/login?message=${encodeURIComponent("Error updating password.")}&type=danger`);
    }
};
