import { asyncHandler } from "../utils/AsyncHandler.js";

const registerUser = asyncHandler((req, res) => {
    const {username, email, password, role} = req.body

    //Validation
    registrationUser(body)


})


export {
    registerUser
}