import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ProjectNote } from "../models/notes.models";

const getNotes = asyncHandler(async (req, res) => {
    // get all notes
    const {projectId} = req.params

    if(!projectId){
      throw new ApiError(400, "project not found")
    }

    const allNotes = await ProjectNote.find({
      project: projectId
    })

    if(!allNotes){
      throw new ApiError(500,"Failed to find all notes")
    }

    return res.status(200).json(
      new ApiResponse(201, allNotes, "Notes fetched successfully")
    )

})
  
const getNoteById = asyncHandler(async (req, res) => {
  const {noteId} = req.params

  if(!noteId){
    throw new ApiError(400, "Note not found")
  }

  const note = await ProjectNote.findById(noteId)

  if(!note){
    throw new ApiError(500, "fetching note get failed")
  }

  return res.status(200).json(
    new ApiResponse(201, note, "note fetched successfully")
  )

})
  
const createNote = asyncHandler(async (req, res) => {
  // create note
  const {content, projectId} = req.body
  const {userId} = req.user._id
  
  if(!content){
    throw new ApiError(400,"content is required field")
  }
  
  const createdNote = await ProjectNote.create({
    createdBy: userId,
    project: projectId,
    content
  })
  
  if(!createdNote){
    throw new ApiError(500,"something went wrong while creating notes")
  }
  return res.status(200).json(
    new ApiResponse(201, createdNote, "Note created successfully")
  )

})
  
const updateNote = asyncHandler(async (req, res) => {
  const {content} = req.body
  const {noteId} = req.params

  if(!content || !noteId){
    throw new ApiError(400, "note not found!!")
  }
  
  const updatedNote = await ProjectNote.findByIdAndUpdate(
    noteId,
        {
            $set:{
                content
            }
        },
        {
            new: true
        }
  )
  
  if(!updatedNote){
    throw new ApiError(500,"something went wrong while creating notes")
  }
  return res.status(200).json(
    new ApiResponse(201, updatedNote, "Note created successfully")
  )
})
  
const deleteNote = asyncHandler(async (req, res) => {
  // delete note
  const {noteId} = req.params

  if(!noteId){
    throw new ApiError(400, "note not found")
  }

  const deletedNote = await ProjectNote.findByIdAndDelete(noteId)

  if(!deleteNote){
    throw new ApiError(500, "note deletion get failed")
  }

  return res.status(200).json(
    new ApiResponse(201, "note deleted successfully")
  )

})
  
export { createNote, deleteNote, getNoteById, getNotes, updateNote };
  