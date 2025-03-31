import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/healthcheck.routes.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})


const app = express()


app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [''],
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/v1/healthCheck",healthCheckRouter)


export default app