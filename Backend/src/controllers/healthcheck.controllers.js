import { ApiResponse } from "../utils/ApiResponse.js"

const healthCheck = (req, res) => {
    try {
        res.status(200).json(
            new ApiResponse(200,{message: 'server is running'})
        )
    } catch (error) {
        
    }
 
}

export {healthCheck}