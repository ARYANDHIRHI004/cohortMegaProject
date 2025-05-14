import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ProjectMember } from "../models/projectmember.models.js";

const getProjects = asyncHandler(async (req, res) => {
    const id = req.user?._id
    const projects = await Project.find({
        createdBY: id
    }) 
    if(!projects){
        throw new ApiError(400, "projects not found")
    }

    return res.status(200).json(
        new ApiResponse(201, projects, "projects found successfully")
    )
    
})

const getProjectsById = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    
    if(!projectId){
        throw new ApiError(401, "Unauthorized request")
    }

    const project = await Project.findById({projectId})

    if(!project){
        throw new ApiError(401, "Project not exist")
    }

    return res.status(200).json(
        new ApiResponse(201, "Project find", project)
    )


    
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
    const {name, description} = req.body
    const {projectId} = req.params

    if(!name || !description){
        throw new ApiError(400, "All fields are required")
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set:{
                name,
                description
            }
        },
        {
            new: true
        }
    )
    return res.status(200).json(
        new ApiResponse(201, updatedProject, "project updated successfully")
    )
    
})

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params

    if(!projectId){
        throw new ApiError(400, "Project not found!!")
    }

    const deletedProject =await Project.findByIdAndDelete(projectId)

    if (!deletedProject) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(201, "Project deleted successfully")
    )
    
})

const addMemberToProject = asyncHandler(async (req, res) => {
    const {projectId, memberId} = req.params

    if(!memberId || !projectId){
        throw new ApiError(400, "all fields are required")
    }

    const memberAdded = await ProjectMember.create({
        user: memberId,
        project: projectId
    })

    if(!memberAdded){
        throw new ApiError(500, "Internal Server error")
    }

    return res.status(200).json(
        new ApiResponse(201, memberAdded, "new Member Added to project")
    )

    
})

const deleteMemberToProject = asyncHandler(async (req, res) => {
    const {userId, projectId} = req.params

    if(!userId || !projectId){
        throw new ApiError(400, "projecti or user not found")
    }

    const deletedMember = await ProjectMember.findByIdAndDelete({
        userId,
        projectId
    })

    if(!deletedMember){
        throw new ApiError(500, "member deletion failed")
    }

    return res.status(200).json(
        new ApiResponse(201, "Member deleted successfully")
    )


    
})

const getMembersToProject = asyncHandler(async (req, res) => {
    //validation
    const {projectId} = req.params

    if(!projectId){
        throw new ApiError(400, "Project not found")
    }

    const members = await ProjectMember.find({project: projectId})
    
    if(!members){
        throw new ApiError(500, "Internal server error")
    }

    return res.status(200).json(
        new ApiResponse(201, members, "Members fetched successfully")
    )
    
})

const updateMemberToProject = asyncHandler(async (req, res) => {
    //validation
    
})

const updateMemberRole = asyncHandler(async (req, res) => {
    //validation
    
})

const deleteMember = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "user not found")
    }

    const deletedMember = await ProjectMember.findByIdAndDelete({
        userId,
    })

    if(!deletedMember){
        throw new ApiError(500, "member deletion failed")
    }

    return res.status(200).json(
        new ApiResponse(201, "Member deleted successfully")
    )

    
})



export {
    getProjects,
    createProject,
    getProjectsById,
    updateProject,
    deleteProject,
    addMemberToProject,
    deleteMemberToProject,
    getMembersToProject,
    deleteMember,

}