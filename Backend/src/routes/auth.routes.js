import { Router } from "express";
import { loginUser, registerUser, verifyEmail} from "../controllers/auth.controllers.js";
import { validator } from "../middlewares/validator.middleware.js";
import { userLoginValidator, 
    userRegistrationVaidator } from "../validators/index.js";

const userRouter = Router()

userRouter.route("/register").post(userRegistrationVaidator(), validator, registerUser)
userRouter.route("/verifyEmail/:token").get(verifyEmail)
userRouter.route("/login").post(userLoginValidator(), validator, loginUser)

// userRouter.route("/logout")
//     .post(registerUser)

export default userRouter



