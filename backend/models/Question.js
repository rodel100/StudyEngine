import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    answer: { type: String },
    choices: { type: [String] },
    id: { type: Number },
    text: { type: String}
});

const Question = mongoose.model('Question', questionSchema);

export default Question;