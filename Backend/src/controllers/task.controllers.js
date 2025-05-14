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
const createSubTask = async (req, res) => {
  // create subtask
}

// update subtask
const updateSubTask = async (req, res) => {
  // update subtask
};

// delete subtask
const deleteSubTask = async (req, res) => {
  // delete subtask
};
  
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
  