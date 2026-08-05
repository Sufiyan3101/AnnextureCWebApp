import express from "express";
import pool from "./db-connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authenticateToken from "./auth.js";
import { authorizeRole } from "./auth.js";

const data_routes = express.Router();


data_routes.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        // comparing user pass with dbpassword
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );


        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                designation: user.designation,
            },
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

data_routes.get("/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT name, email, mobile, alternate_email, role, designation
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            user: result.rows[0],
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// ================= Insert Data =================
data_routes.post(
    "/user-add",
    authenticateToken,
    authorizeRole("admin"),
    async (req, res) => {
        const {
            name,
            email,
            mobile,
            password,
            role,
            alternate_email,
            designation,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await pool.query(
                `INSERT INTO users (
                    name,
                    email,
                    mobile,
                    password_hash,
                    role,
                    alternate_email,
                    designation,
                    updated_at
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [
                    name,
                    email,
                    mobile,
                    hashedPassword,
                    role,
                    alternate_email,
                    designation,
                    new Date(),
                ]
            );

            res.status(201).json({
                success: true,
                message: "User created successfully",
            });

        } catch (err) {

            // PostgreSQL unique constraint violation
            if (err.code === "23505") {

                if (err.constraint === "users_email_key") {
                    return res.status(409).json({
                        success: false,
                        message: "Email already exists.",
                    });
                }

                if (err.constraint === "users_mobile_key") {
                    return res.status(409).json({
                        success: false,
                        message: "Mobile number already exists.",
                    });
                }

                return res.status(409).json({
                    success: false,
                    message: "User already exists.",
                });
            }

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }
);

export default data_routes;