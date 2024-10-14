import mongoose from 'mongoose';
const studyGroupSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membersEmail: [{type: String}],
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    name: {type: String, required: true},
    scores: [{name: {type: String}, email: { type: String, required: true }, score: { type: Number, required: true }, questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]}]
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export {StudyGroup}