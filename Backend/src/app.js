import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/healthcheck.routes"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [''],
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("api/v1/healthCheck",healthCheckRouter)


export default app