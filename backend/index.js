import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./data-get-post.js";
import data_routes from "./users-fetch.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://13.53.101.224"
    ],
    credentials: true
}));

app.use(express.json());

// All routes
app.use("/", routes);
app.use("/", data_routes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});