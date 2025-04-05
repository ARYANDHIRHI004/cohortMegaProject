import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    avatar:{
        type: {
            url: String,
            localpath: String
        },
        default:{
            url: ``,
            localpath: ""
        },
        required: [true, "Avatar is required"]
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String,
    },
    emailVerificationTokenExpity:{
        type: Date,
    },
    forgotPasswordToken:{
        type: String,
    },
    forgotPasswordExpity:{
        type: Date,
    },
    refreshToken:{
        type: String,

    },
    refreshPasswordExpity:{
        type: Date,
    },


},{timestamps: true})

userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
})

userSchema.methods.comparePassword = async function(password){
    const isMatched = await bcrypt.compare(password, this.password)
    return isMatched
}

userSchema.models.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.models.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

userSchema.models.generateTemproryToken = function(){
    const unHashedToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")
    const tokenExpiry = Date.now() + (20*60*1000)
    return {unHashedToken, hashedToken, tokenExpiry}
}



export const User = mongoose.model('User', userSchema)