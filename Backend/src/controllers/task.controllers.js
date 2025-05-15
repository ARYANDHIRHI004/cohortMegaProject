import { Subtask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// get all tasks
const getTasks = asyncHandler(async (req, res) => {
    // get all tasks
    const {projectId} = req.params

    if(!projectId){
        throw new ApiError(400, "Note not found")
    }

    const allTasks = await Task.find({
      project: projectId
    })

    if(!allTasks){
      throw new ApiError(500, "task fetching get failed")
    }

    return res.status(200).json(
      new ApiResponse(201, allTasks, "tasks fetched successfully")
    )

})

const getTaskById = asyncHandler(async (req, res) => {
  // get task by id
  const {taskId} = req.params;
  const task = await Task.findById(taskId)

  if(!task){
    throw new ApiError(500, "Task not found!!")
  }

  return res.status(200).json(
    new ApiResponse(201, task, "Task fetcjed successfully")
  )

})
  
// create task
const createTask = asyncHandler(async (req, res) => {
  // create task
  const {title, description, status, assignedBy, assignedTo} = req.body
  const {projectId} = req.params

  if(!title || !description || !status || !assignedBy || !assignedTo){
    throw new ApiError(400, "All field are required")
  }

  const createdTask = await Task.create({
    title,
    description,
    status,
    assignedBy,
    assignedTo,
    project: projectId
  })

  if(!createdTask){
      throw new ApiError(400, "something went wrong while creating task")
  }

  return res.status(200).json(
    new ApiResponse(200, createdTask, "Task created successfully")
  )

})

// update task
const updateTask = asyncHandler(async (req, res) => {
  // update task
  const {title, description, status, assignedBy, assignedTo} = req.body
  const {taskId} = req.params

  if(!title || !description || !status || !assignedBy || !assignedTo){
    throw new ApiError(400, "All field are required")
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        title,
        description,
        status,
        assignedBy,
        assignedTo,
      }
    },
    {
      new: true
    }
  )

  if(!updatedTask){
      throw new ApiError(400, "something went wrong while creating task")
  }

  return res.status(200).json(
    new ApiResponse(200, updatedTask, "Task updated successfully")
  )

});

// delete task
const deleteTask = asyncHandler(async (req, res) => {
  // delete task
  const {taskId} = req.params;

  const deletedTask = await Task.findByIdAndDelete(taskId)

  if(!deletedTask){
    throw new ApiError(500, "deletion get failed")
  }

  return res.status(200).json(
    new ApiResponse(201, "Task deleted successfully")
  )
})

// create subtask
const createSubTask = asyncHandler(async (req, res) => {
  // create subtask
  const {title, createdBy}  = req.body
  const {taskId} = req.params

  if(!title || !isCompleted || !createdBy){
    throw new ApiError(400, "All field are required")
  }

  const createdSubTask = await Subtask.create({
    title,
    task: taskId,
    createdBy
  })

  if(!createdSubTask){
    throw new ApiError(500, "something went wrong while creating sub task")
  }

  return res.status(200).json(201, createdSubTask, "SubTask created successfully" )

})

// update subtask
const updateSubTask = asyncHandler(async (req, res) => {
  // create subtask
  const {title, createdBy}  = req.body
  const {subTaskId} = req.params

  if(!title || !createdBy){
    throw new ApiError(400, "All field are required")
  }

  const updatedSubTask = await Subtask.findByIdAndUpdate(
    subTaskId,
    {
      $set:{
        title,
        createdBy
      }
    },
    {
      new: true
    }
  )

  if(!updatedSubTask){
    throw new ApiError(500, "something went wrong while updating sub task")
  }

  return res.status(200).json(201, updatedSubTask, "SubTask updated successfully" )

})

// delete subtask
const deleteSubTask = asyncHandler(async (req, res) => {
  // create subtask
  const {subTaskId} = req.params

  const deletedSubTask = await Subtask.findByIdAndDelete(subTaskId)

  if(!deletedSubTask){
    throw new ApiError(500, "deletion get failed!!")
  }

  return res.status(200).json(201, "SubTask deleted successfully" )

})
  
  export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
  };
  