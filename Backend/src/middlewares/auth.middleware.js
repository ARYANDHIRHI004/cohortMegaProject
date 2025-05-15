import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";


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

const isProjectAdmin = (roles = []) => (async (req, _ , next) => {
    try {
        const userId = req.user._id
        const {projectId} = req.params
        console.log(projectId);

        if(!userId){
           throw new ApiError(400, "Not logged in")
        }
    
        const member = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(req.user._id),
            project:  new mongoose.Types.ObjectId(projectId)
        })

        if(!member){
            throw new ApiError(400, "you are not member of the project")
        }

        const role = member?.role
        
        req.user.role = role

        if(!roles.includes(role)){
            throw new ApiError(400, "unauthorized request")
        }
        console.log('aryan');
        
        next()
        
    } catch (error) {
        console.log("invalid token"); 
    }
    
})




export { verifyJWT, isProjectAdmin}