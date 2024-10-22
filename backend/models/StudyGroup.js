import mongoose from 'mongoose';
const studyGroupSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ name: { type: String, required: true }, email: { type: String, required: true } }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    name: { type: String, required: true },
    scores: [{ name: { type: String }, email: { type: String, required: true }, score: { type: Number, required: true }}],
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;