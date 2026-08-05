import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./data-get-post.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// All routes
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});