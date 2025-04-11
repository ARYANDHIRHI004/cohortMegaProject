import { Router } from "express";
import { loginUser,
     logoutUser, 
     refreshAccessToken, 
     registerUser, 
     resendVerifyEmail, 
     verifyEmail,
     changeCurrentPassword} from "../controllers/auth.controllers.js";

import { validator } from "../middlewares/validator.middleware.js";
import { userLoginValidator, 
    userRegistrationVaidator } from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(userRegistrationVaidator(), validator, registerUser)
userRouter.route("/verifyEmail/:token").get(verifyEmail)
userRouter.route("/resend-emailVerification").get(resendVerifyEmail)
userRouter.route("/login").post(userLoginValidator(), validator, loginUser)
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/refreshAccessToken").post(refreshAccessToken)
userRouter.route("/changePassword").post(verifyJWT, changeCurrentPassword)



export default userRouter



