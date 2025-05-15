import { Router } from "express";
import { addMemberToProject, createProject, deleteMemberToProject, deleteProject, getMembersToProject, getProjects, getProjectsById, updateProject } from "../controllers/project.controllers.js";
import { isProjectAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../constants.js";

const projectRouter = Router()

projectRouter.route("/createProject").post(verifyJWT, createProject)

projectRouter.route("/getProjects").get(verifyJWT, getProjects)

projectRouter.route("/getProjectById/:projectId").get(verifyJWT, isProjectAdmin([UserRolesEnum.PROJECT_ADMIN, UserRolesEnum.MEMBER]),getProjectsById)

projectRouter.route("/deleteProject/:projectId").get(verifyJWT, isProjectAdmin([UserRolesEnum.PROJECT_ADMIN]), deleteProject)

projectRouter.route("/updateProject/:projectId").get(verifyJWT, isProjectAdmin([UserRolesEnum.PROJECT_ADMIN]), updateProject)

projectRouter.route("/addMember/:projectId?/:memberId?").get(verifyJWT, isProjectAdmin([UserRolesEnum.PROJECT_ADMIN]), addMemberToProject)

projectRouter.route("/removeMember/:projectId").get(verifyJWT, isProjectAdmin([UserRolesEnum.PROJECT_ADMIN]), deleteMemberToProject)

projectRouter.route("/getProjectMember/:projectId").get(verifyJWT,isProjectAdmin([UserRolesEnum.PROJECT_ADMIN, UserRolesEnum.MEMBER]), getMembersToProject)

export default projectRouter