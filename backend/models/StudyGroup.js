const studyGroupSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    projects: [{type: mongoose.Schema.types.ObjectId, ref: 'Project'}],
    name: {type: String, required: true},
    scores: [{user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true }}],
    });

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export {StudyGroup}