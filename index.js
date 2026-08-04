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

        const { search, fromDate, toDate } = req.query;

        let where = "WHERE 1=1";
        const values = [];
        let index = 1;

        if (search) {
            where += `
        AND (
            particularsofasset ILIKE $${index}
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

// This route is use to upload data into database 
app.post("/post-data", async (req, res) => {
    const {
        particulars,
        purchaseDate,
        cost,
        classification,
        assignedTo,
        location,
    } = req.body;

    try {
        // Insert without assetcode
        const result = await pool.query(
            `INSERT INTO formdetails (
                particularsofasset,
                dateofpurchase,
                costofstore,
                classification_of_store,
                assignedto,
                location
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
            [
                particulars,
                purchaseDate,
                cost,
                classification,
                assignedTo,
                location,
            ]
        );

        const id = result.rows[0].id;
        const assetCode = `IITK/EE/C/AS${id}`;

        // Update assetcode
        await pool.query(
            `UPDATE formdetails
             SET assetcode = $1
             WHERE id = $2`,
            [assetCode, id]
        );

        res.status(201).json({
            message: "Data inserted successfully",
            assetCode,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
});