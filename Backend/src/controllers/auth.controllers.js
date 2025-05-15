import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { sendMail, emailVerificationMailGenContent, passwordResetMailGenContent } from "../utils/mail.js";
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

    const isPasswordCorrect = await user.comparePassword(password)

    
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid Credentials")
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
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
    const user = await User.findById(req.user._id)
    user.emailVerificationToken = undefined
    await user.save()

    const options ={
    httpOnly: true,
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(201, "Loggout successfully")
    )
          
})

const verifyEmail = asyncHandler(async (req, res) => {
    const {token} = req.params
    
    if(!token){ 
        throw new ApiError(401, "Token not found")
    }
    const user = await User.findOne({emailVerificationToken: token})

    if(!user){
        throw new ApiError(401, "Invalid Token")
    }
    
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    await user.save()
    return res.status(200).json(
        new ApiResponse(201, "Email verified")
    )
    

})

const resendVerifyEmail = asyncHandler(async (req, res) => {

    const user = await User.findOne(req.user._id)
    if(!user){
        throw new ApiError(400, "unauthorized email request")
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
    
    return res.status(200).json(
        new ApiResponse(200, "Email sended")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { token } = req.cookies?.refreshToken
    if(!token){
        throw new ApiError(400, "User is logged out")
    }
    
    const user = await User.findById(token._id)
    if(!user){
        throw new ApiError(400, "Invalid token")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const options ={
        httpOnly: true,
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(201, "access token refreshed successfully")
    )

            
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {email} = req.body
    
    if(!email){
        throw new ApiError(400, "Email is reqired")
    }
    
    const user = await User.findOne({email})
    
    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const emailResetPasswordToken = crypto.randomBytes(32).toString("hex")
    const mailOption = {
        email: user.email,
        subject: "Password reset",
        mailGenContent: passwordResetMailGenContent(
            user.username,
            `http://localhost:8000/api/v1/user/forgotPassword/${emailResetPasswordToken}`
        )
    }
    const isMailsend = await sendMail(mailOption)

    if(!isMailsend){
        throw new ApiError(500, "email send get failed")
    }
    user.forgotPasswordToken = emailResetPasswordToken
    await user.save()

    const {token}  = req.params()
    const userByToken = await User.findOne({forgotPasswordToken: token})
    
    if(!userByToken){
        throw new ApiError(401, "Invalid Token")
    }
    
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {newPassword, confirmPassword} = req.body

    if(!newPassword || !confirmPassword){
        throw new ApiError(400, "All fields are required")
    }
    
    
    if(newPassword !== confirmPassword){
        throw new ApiError(400, "confirm password does not matches new password")
    }

    const user = await User.findById(req.user._id)


    if(!user){
        throw new ApiError(400, "User not logged in")
    }

    user.password = newPassword
    await user.save()

    return res.status(201).json(
        new ApiResponse(200,"Password updated succesfully")
    )
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const {userId} = req.user._id 
    
    const user = await User.findById(userId).select("-password -accessTokee -refreshToken")

    if(!user){
        throw new ApiError(400, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(201, user, "Current user find successfully")
    )

})



export {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    resendVerifyEmail,
    refreshAccessToken,
    forgotPasswordRequest,
    changeCurrentPassword,
    getCurrentUser,
}





