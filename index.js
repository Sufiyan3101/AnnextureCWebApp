import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

// This route is use to fetch data from the database 
app.get("/data", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const { search, fromDate, toDate, intendorName, projectNumber, poNumber, equipmentType } = req.query;

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


        // Total rows matching filters
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM formdetails
            ${where}
        `;

        const countResult = await pool.query(countQuery, values);

        // Current page data
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
            totalPages: Math.ceil(Number(countResult.rows[0].total) / limit)
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/project-number", async (req, res) => {
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
                value: row.project_number
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/po-number", async (req, res) => {
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
                value: row.po_number
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/asset-code", async (req, res) => {
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
                value: row.assetcode
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/intendor-name", async (req, res) => {
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
                value: row.intendor_name
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/locations", async (req, res) => {
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
                value: row.location
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/assigned-to", async (req, res) => {
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
                value: row.assignedto
            }))
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// This route is use to upload data into database 
app.post("/post-data", async (req, res) => {
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
        asset_classification
    } = req.body;

    try {
        // Insert without assetcode
        const result = await pool.query(
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id`,
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

        // const id = result.rows[0].id;
        // const assetCode = `IITK/EE/C/AS${id}`;

        // // Update assetcode
        // await pool.query(
        //     `UPDATE formdetails
        //      SET assetcode = $1
        //      WHERE id = $2`,
        //     [assetCode, id]
        // );

        res.status(201).json({
            message: "Data inserted successfully",
            // assetCode,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
});