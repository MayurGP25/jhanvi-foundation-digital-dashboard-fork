const db = require("../config/db"); // your db pool
const multer = require("multer");

// Multer setup for photo upload
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.showAddForm = async (req, res) => {
    try {
        const [jobTypes] = await db.query("SELECT id, job_type_name FROM job_types ORDER BY id ASC");
        res.render("beneficiary-add", { user: req.session.user, jobTypes });
    } catch (err) {
        console.error(err);
        res.send("Error loading form.");
    }
};


// Add Beneficiary
exports.addBeneficiary = async (req, res) => {
    const {
        beneficiary_name,
        guardian_name,
        age,
        gender,
        education,
        marital_status,
        children_count,
        id_mark,
        location,
        health_status,
        habits,
        occupation_id,
        occupation_place,
        reference_name,
        reference_address,
        contact_no,
        reason_ulb,
        stay_type,
        remarks
    } = req.body;

    const photo = req.file ? req.file.buffer : null;

    try {
        await db.query(
            `INSERT INTO beneficiaries
            (beneficiary_name, guardian_name, age, gender, education, marital_status, children_count, id_mark,
             location, health_status, habits, occupation_id, occupation_place, reference_name, reference_address,
             contact_no, reason_ulb, stay_type, remarks, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [beneficiary_name, guardian_name, age, gender, education, marital_status, children_count, id_mark,
             location, health_status, habits, occupation_id, occupation_place, reference_name, reference_address,
             contact_no, reason_ulb, stay_type, remarks, photo]
        );

        res.redirect("/beneficiaries/menu");

    } catch (err) {
        console.error(err);
        res.send("Error adding beneficiary.");
    }
};
exports.viewBeneficiaries = async (req, res) => {
    const searchQuery = req.query.search || ""; // get search input
    try {
        let sql = "SELECT id, beneficiary_name, guardian_name, age, gender, location, contact_no, photo FROM beneficiaries";
        let params = [];

        if (searchQuery) {
            sql += " WHERE beneficiary_name LIKE ?";
            params.push(`%${searchQuery}%`);
        }

        const [rows] = await db.query(sql, params);

        res.render("beneficiary-view", {
            user: req.session.user,
            beneficiaries: rows,
            searchQuery
        });

    } catch (err) {
        console.error(err);
        res.send("Error fetching beneficiaries.");
    }
};
exports.downloadPhoto = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT photo, beneficiary_name FROM beneficiaries WHERE id = ?", [id]);
        if (rows.length === 0 || !rows[0].photo) return res.status(404).send("Photo not found");

        res.setHeader('Content-Disposition', `attachment; filename=${rows[0].beneficiary_name}.jpg`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(rows[0].photo);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading photo");
    }
};

module.exports.upload = upload; // export multer for routes
