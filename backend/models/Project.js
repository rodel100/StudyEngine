import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    answer: { type: String, required: true },
    choices: { type: [String], required: true },
    id: { type: Number, required: true, unique: true },
    text: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    endpoints: [{ type: String }],
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    studygroup: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' },
    emailFrequency: String,
    NumberofQuestions: Number,
    Questions: [{ Name: String, Question: [questionSchema] }]
});

const Project = mongoose.model('Project', projectSchema);

export default Project;