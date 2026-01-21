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

exports.showAddFormPublic = async (req, res) => {
    // UI only: use static jobTypes, no DB
    const jobTypes = [
        { id: 1, job_type_name: "Unskilled" },
        { id: 2, job_type_name: "Skilled" },
        { id: 3, job_type_name: "Self-employed" },
        { id: 4, job_type_name: "Other" }
    ];
    const user = req.session && req.session.user ? req.session.user : null;
    res.render("beneficiary-add", { user, jobTypes });
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
        let sql = "SELECT id, beneficiary_name, guardian_name, age, gender, education, marital_status, children_count, location, health_status, occupation_id, occupation_place, reference_name, reference_address, contact_no, stay_type, remarks, photo FROM beneficiaries";
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

// Edit Beneficiary - Show List
exports.showEditList = async (req, res) => {
    const searchQuery = req.query.search || "";
    try {
        let sql = "SELECT id, beneficiary_name, guardian_name, age, gender, education, marital_status, children_count, location, health_status, occupation_id, occupation_place, reference_name, reference_address, contact_no, stay_type, remarks FROM beneficiaries";
        let params = [];

        if (searchQuery) {
            sql += " WHERE beneficiary_name LIKE ?";
            params.push(`%${searchQuery}%`);
        }

        const [rows] = await db.query(sql, params);

        res.render("beneficiary-edit-list", {
            user: req.session.user,
            beneficiaries: rows,
            searchQuery
        });

    } catch (err) {
        console.error(err);
        res.send("Error fetching beneficiaries.");
    }
};

// Edit Beneficiary - Show Edit Form
exports.showEditForm = async (req, res) => {
    const id = req.params.id;
    try {
        const [jobTypes] = await db.query("SELECT id, job_type_name FROM job_types ORDER BY id ASC");
        const [rows] = await db.query("SELECT * FROM beneficiaries WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).send("Beneficiary not found");
        }

        res.render("beneficiary-edit-form", {
            user: req.session.user,
            beneficiary: rows[0],
            jobTypes
        });

    } catch (err) {
        console.error(err);
        res.send("Error loading edit form.");
    }
};

// Edit Beneficiary - Update
exports.updateBeneficiary = async (req, res) => {
    const id = req.params.id;
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
        let sql = `UPDATE beneficiaries SET 
            beneficiary_name = ?, guardian_name = ?, age = ?, gender = ?, education = ?, 
            marital_status = ?, children_count = ?, id_mark = ?, location = ?, health_status = ?, 
            habits = ?, occupation_id = ?, occupation_place = ?, reference_name = ?, 
            reference_address = ?, contact_no = ?, reason_ulb = ?, stay_type = ?, remarks = ?`;
        
        const params = [
            beneficiary_name, guardian_name, age, gender, education, marital_status, 
            children_count, id_mark, location, health_status, habits, occupation_id, 
            occupation_place, reference_name, reference_address, contact_no, 
            reason_ulb, stay_type, remarks
        ];

        // Only update photo if a new one is uploaded
        if (photo) {
            sql += ", photo = ?";
            params.push(photo);
        }

        sql += " WHERE id = ?";
        params.push(id);

        await db.query(sql, params);

        res.redirect("/beneficiaries/edit");

    } catch (err) {
        console.error(err);
        res.send("Error updating beneficiary.");
    }
};

// Delete Beneficiary
exports.deleteBeneficiary = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM beneficiaries WHERE id = ?", [id]);
        res.redirect("/beneficiaries/edit");
    } catch (err) {
        console.error(err);
        res.send("Error deleting beneficiary.");
    }
};

module.exports.upload = upload; // export multer for routes
