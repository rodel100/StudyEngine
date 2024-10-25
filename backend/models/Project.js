import mongoose from "mongoose";
import Question from "./Question.js";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ Name: String, Email: String}],
    endpoints: [{ type: String }],
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    studygroup: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' },
    emailFrequency: {type:String, default: 'daily'},
    NumberofQuestions: {type: Number, default: 30},
    Questions: [{ Name: String, Questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}] }]
});

const Project = mongoose.model('Project', projectSchema);

export default Project;