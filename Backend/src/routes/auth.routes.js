import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validator } from "../middlewares/validator.middleware.js";
import { userRegistrationVaidator } from "../validators/index.js";

const userRouter = Router()

healthCheckRouter.route("/register")
    .post(userRegistrationVaidator(), validator, registerUser)

export default userRouter



