import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, _ , next) => {
    try {
        const token = req.cookies?.accessToken
        console.log(token);

        if(!token){
            throw new ApiError(400, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken);
        req.user = decodedToken
        next()  
    } catch (error) {
        console.log("invalid token"); 
    }   
}

export { verifyJWT }