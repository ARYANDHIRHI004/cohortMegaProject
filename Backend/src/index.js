import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/db.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening at port: ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit(1)
    })