const db = require("../config/db");
 
// Show Add Job Provider Form
exports.showAddForm = async (req, res) => {
    try {
        res.render("jobprovider-add", { user: req.session.user, jobProvider: null });
    } catch (err) {
        console.error(err);
        res.send("Error loading form.");
    }
};
 
// Add Job Provider
exports.addJobProvider = async (req, res) => {
    const {
        provider_name,
        contact_person,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        notes
    } = req.body;
 
    try {
        await db.query(
            `INSERT INTO job_providers
            (provider_name, contact_person, phone, email, address, city, state, pincode, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [provider_name, contact_person, phone, email, address, city, state, pincode, notes]
        );
 
        res.redirect("/jobproviders/menu");
 
    } catch (err) {
        console.error(err);
        res.send("Error adding job provider.");
    }
};
 
// View all Job Providers
exports.viewJobProviders = async (req, res) => {
    const searchQuery = req.query.search || "";
    try {
        let sql = "SELECT id, provider_name, contact_person, phone, email, city, state FROM job_providers";
        let params = [];
 
        if (searchQuery) {
            sql += " WHERE provider_name LIKE ? OR contact_person LIKE ?";
            params.push(`%${searchQuery}%`, `%${searchQuery}%`);
        }
 
        const [rows] = await db.query(sql, params);
 
        res.render("jobprovider-view", {
            user: req.session.user,
            jobProviders: rows,
            searchQuery
        });
 
    } catch (err) {
        console.error(err);
        res.send("Error fetching job providers.");
    }
};
 
// Show Edit Form
exports.showEditForm = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT * FROM job_providers WHERE id = ?", [id]);
        if (rows.length === 0) return res.send("Job Provider not found.");
 
        res.render("jobprovider-add", { user: req.session.user, jobProvider: rows[0] });
 
    } catch (err) {
        console.error(err);
        res.send("Error fetching job provider.");
    }
};
 
// Update Job Provider
exports.updateJobProvider = async (req, res) => {
    const id = req.params.id;
    const {
        provider_name,
        contact_person,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        notes
    } = req.body;
 
    try {
        await db.query(
            `UPDATE job_providers SET provider_name = ?, contact_person = ?, phone = ?, email = ?, address = ?, city = ?, state = ?, pincode = ?, notes = ? WHERE id = ?`, [provider_name, contact_person, phone, email, address, city, state, pincode, notes, id]
        );
 
        res.redirect("/jobproviders/menu");
 
    } catch (err) {
        console.error(err);
        res.send("Error updating job provider.");
    }
};
 
// Delete Job Provider
exports.deleteJobProvider = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM job_providers WHERE id = ?", [id]);
        res.redirect("/jobproviders/view");
 
    } catch (err) {
        console.error(err);
        res.send("Error deleting job provider.");
    }
};