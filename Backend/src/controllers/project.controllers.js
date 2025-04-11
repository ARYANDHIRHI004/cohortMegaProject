import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getProjects = asyncHandler(async (req, res) => {
    
    
})

const getProjectsById = asyncHandler(async (req, res) => {
    //validation
    
})

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description){
        throw new ApiError(400, "Name and description is required")
    }
    
    const project = await Project.create({
        name,
        description,
        creadedBy: req.user?._id
    })

    if(!project){
        throw new ApiError(500, "Project creation failed")
    }
        
    return res.status(200).json(
        new ApiResponse(201, "Project created successfully")
    )
})

const updateProject = asyncHandler(async (req, res) => {
    //validation
    
})

const deleteProject = asyncHandler(async (req, res) => {
    //validation
    
})

const addMemberToProject = asyncHandler(async (req, res) => {
    //validation
    
})

const deleteMemberToProject = asyncHandler(async (req, res) => {
    //validation
    
})

const getMemberToProject = asyncHandler(async (req, res) => {
    //validation
    
})

const updateMemberToProject = asyncHandler(async (req, res) => {
    //validation
    
})

const updateMemberRole = asyncHandler(async (req, res) => {
    //validation
    
})

const deleteMember = asyncHandler(async (req, res) => {
    //validation
    
})



export {
    createProject,
}