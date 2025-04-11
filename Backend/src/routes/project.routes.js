import { Router } from "express";
import { createProject } from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const projectRouter = Router()

projectRouter.route("/createProject").get(verifyJWT, createProject)

export default projectRouter