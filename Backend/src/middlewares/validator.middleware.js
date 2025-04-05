import {validationResult} from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

export const validator = (req, res, next) => {
    const errors = validationResult(req)
    // console.log(errors);
    
    if (errors.isEmpty()) {
        return next()
    }

    const extrectedErrors = []
    errors.array().map((err)=> extrectedErrors.push({
        [err.path] : err.msg
    }))

    throw new ApiError(422, "Recived data is not valid", extrectedErrors)
}
