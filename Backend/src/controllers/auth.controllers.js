import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { sendMail, emailVerificationMailGenContent } from "../utils/mail.js";
import crypto from "crypto"

const generateAccessAndRefreshToken = async function(userID){
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(501, "Fail to generate access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const {fullname, username, email, password} = req.body

    if(!fullname || !username || !email || !password){
        throw new ApiError(401, "All fields are required...")
    }

    const exixtedUser = await User.findOne({username})

    if(exixtedUser){
        throw new ApiError(400, "User already exist.")
    }
    
    const user = await User.create({
        fullname,
        username,
        email,
        password   
    })

    if(!user){
        throw new ApiError(501, "User creation failed")
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    const mailOption = {
        email: user.email,
        subject: "Email verification",
        mailGenContent: emailVerificationMailGenContent(
            username,
            `http://localhost:8000/api/v1/user/verifyEmail/${emailVerificationToken}`
        )
    }
    const isMailsend = await sendMail(mailOption)

    if(!isMailsend){
        throw new ApiError(500, "email send get failed")
    }
    user.emailVerificationToken = emailVerificationToken
    await user.save({validateBeforeSave: false})

    return res.status(201).json(
        new ApiResponse(200,"User created Successfully")
    )


})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    
    if(!email || !password){
        throw new ApiError(400, "Email and password is required");
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(401, "User does not exist");
    }

    const isPasswordCorrect = user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid Credentials")
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    // console.log(accessToken);
    
    const options ={
        httpOnly: true,
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(201, "LoggedIn successfully")
    )
    

})

const logoutUser = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    

})

const verifyEmail = asyncHandler(async (req, res) => {
   const {token} = req.params
   
   if(!token){ 
    throw new ApiError(401, "Token not found")
   }

   return res.status(200).json(
    new ApiResponse(201, "verified")
   )
    

})

const resendVerifyEmail = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body

    //validation
    
})



export {
    registerUser,
    loginUser,
    verifyEmail
}





