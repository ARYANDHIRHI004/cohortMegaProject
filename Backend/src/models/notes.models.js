import mongoose, { Schema } from "mongoose";

const ProjectNoteSchema = new mongoose.Schema({
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    content:{
        type: String,
        required: true,
    }

},{timestamps: true})

export const  ProjectNote = mongoose.model('ProjectNote', ProjectNoteSchema)