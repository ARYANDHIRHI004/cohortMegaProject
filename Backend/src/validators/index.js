import {body} from 'express-validator'

const userRegistrationVaidator = () => {
  return [
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
        
    body('username')
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 3}).withMessage("atleast 3 charactor is required")
        .isLength({max: 13}).withMessage("cannot exceed 13 charactor"),

    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({min: 3}).withMessage("atleast 3 charactor is required")
  ]
}

const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty")
  ]
}


export { userRegistrationVaidator, userLoginValidator }