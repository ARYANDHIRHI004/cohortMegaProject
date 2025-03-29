import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String
    },
    desciption:{
        type: String
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status:{
        type: String,
    },
    attachments:{
        type: [
            {
                url: String,
                mimetype: String,
                size: Number
            }
        ],
        default: []
    }
},{timestamps: true});



export const Task = mongoose.model('Task', taskSchema)