import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    profilePicture: String
  });

const User = mongoose.model('User', userSchema);

export {User}