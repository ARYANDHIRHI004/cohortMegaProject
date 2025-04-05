import {body} from 'express-validator'

const userRegistrationVaidator = () => {
  return [
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
        
    body('username')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isLength({min: 3}).withMessage("atleast 3 charactor is required")
        .isLength({max: 13}).withMessage("cannot exceed 13 charactor")
  ]
}

const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty")
  ]
}


export { userRegistrationVaidator, userLoginValidator }