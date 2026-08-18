import express from "express";
import pool from "./db-connection.js";
import authenticateToken from "./auth.js";

const router = express.Router();

// ================= Fetch Data =================
router.get("/data", authenticateToken, async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const {
            search,
            fromDate,
            toDate,
            intendorName,
            projectNumber,
            poNumber,
            equipmentType
        } = req.query;

        let where = "WHERE 1=1";
        const values = [];
        let index = 1;

        if (search) {
            where += `
                AND (
                    technical_specification ILIKE $${index}
                    OR assetcode ILIKE $${index}
                    OR assignedto ILIKE $${index}
                    OR location ILIKE $${index}
                )
            `;
            values.push(`%${search}%`);
            index++;
        }

        if (fromDate) {
            where += ` AND dateofpurchase >= $${index}`;
            values.push(fromDate);
            index++;
        }

        if (toDate) {
            where += ` AND dateofpurchase <= $${index}`;
            values.push(toDate);
            index++;
        }

        if (intendorName) {
            where += ` AND intendor_name = $${index}`;
            values.push(intendorName);
            index++;
        }

        if (projectNumber) {
            where += ` AND project_number = $${index}`;
            values.push(projectNumber);
            index++;
        }

        if (poNumber) {
            where += ` AND po_number = $${index}`;
            values.push(poNumber);
            index++;
        }

        if (equipmentType) {
            where += ` AND asset_classification = $${index}`;
            values.push(equipmentType);
            index++;
        }

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM formdetails
            ${where}
        `;

        const countResult = await pool.query(countQuery, values);

        const dataQuery = `
            SELECT *
            FROM formdetails
            ${where}
            ORDER BY id DESC
            LIMIT $${index}
            OFFSET $${index + 1}
        `;

        const dataValues = [...values, limit, offset];
        const dataResult = await pool.query(dataQuery, dataValues);

        res.json({
            data: dataResult.rows,
            total: Number(countResult.rows[0].total),
            page,
            limit,
            totalPages: Math.ceil(Number(countResult.rows[0].total) / limit),
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= Project Number =================
router.get("/project-number", authenticateToken,async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT project_number
            FROM formdetails
            WHERE project_number IS NOT NULL
            ORDER BY project_number
        `);

        res.json(
            result.rows.map(row => ({
                label: row.project_number,
                value: row.project_number,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= PO Number =================
router.get("/po-number", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT po_number
            FROM formdetails
            WHERE po_number IS NOT NULL
            ORDER BY po_number
        `);

        res.json(
            result.rows.map(row => ({
                label: row.po_number,
                value: row.po_number,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= Asset Code =================
router.get("/asset-code", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT assetcode
            FROM formdetails
            WHERE assetcode IS NOT NULL
            ORDER BY assetcode
        `);

        res.json(
            result.rows.map(row => ({
                label: row.assetcode,
                value: row.assetcode,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= Intendor Name =================
router.get("/intendor-name", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT intendor_name
            FROM formdetails
            WHERE intendor_name IS NOT NULL
            ORDER BY intendor_name
        `);

        res.json(
            result.rows.map(row => ({
                label: row.intendor_name,
                value: row.intendor_name,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= Locations =================
router.get("/locations", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT location
            FROM formdetails
            WHERE location IS NOT NULL
            ORDER BY location
        `);

        res.json(
            result.rows.map(row => ({
                label: row.location,
                value: row.location,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= Assigned To =================
router.get("/assigned-to", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT assignedto
            FROM formdetails
            WHERE assignedto IS NOT NULL
            ORDER BY assignedto
        `);

        res.json(
            result.rows.map(row => ({
                label: row.assignedto,
                value: row.assignedto,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= Insert Data =================
router.post("/post-data", authenticateToken, async (req, res) => {
    const {
        asset_code,
        project_no,
        po_no,
        intendor_name,
        technical_specification,
        make,
        model,
        rating,
        purchaseDate,
        cost,
        store_classification,
        assignedTo,
        location,
        asset_classification,
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO formdetails (
                assetcode,
                project_number,
                po_number,
                intendor_name,
                technical_specification,
                make,
                model,
                rating,
                dateofpurchase,
                costofstore,
                classification_of_store,
                assignedto,
                location,
                asset_classification
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
            [
                asset_code,
                project_no,
                po_no,
                intendor_name,
                technical_specification,
                make,
                model,
                rating,
                purchaseDate,
                cost,
                store_classification,
                assignedTo,
                location,
                asset_classification,
            ]
        );

        res.status(201).json({
            message: "Data inserted successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= Insert Data Through Excel =================
router.post("/post-data-excel", authenticateToken, async (req, res) => {
    const rows = req.body; // this is an array of row objects

    if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: "No data provided" });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const row of rows) {
            const {
                asset_code,
                project_no,
                po_no,
                intendor_name,
                technical_specification,
                make,
                model,
                rating,
                purchaseDate,
                cost,
                store_classification,
                assignedTo,
                location,
                asset_classification,
            } = row;

            await client.query(
                `INSERT INTO formdetails (
                    assetcode,
                    project_number,
                    po_number,
                    intendor_name,
                    technical_specification,
                    make,
                    model,
                    rating,
                    dateofpurchase,
                    costofstore,
                    classification_of_store,
                    assignedto,
                    location,
                    asset_classification
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
                [
                    asset_code,
                    project_no,
                    po_no,
                    intendor_name,
                    technical_specification,
                    make,
                    model,
                    rating,
                    purchaseDate,
                    cost,
                    store_classification,
                    assignedTo,
                    location,
                    asset_classification,
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: `${rows.length} row(s) inserted successfully`,
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

export default router;