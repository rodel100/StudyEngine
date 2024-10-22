import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(bodyParser.json());


const SECRET_KEY = process.env.JSON_TOKEN_SECRET_KEY;

const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  
const User = mongoose.model('User', userSchema);

async function registerUser(req, res) {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
        const { username, password, email, firstName, lastName } = req.body;    
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username: username, password: hashedPassword, email: email, firstName: firstName, lastName: lastName});
      await user.save();
      
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: `Server error, ${err}` });
    }
}

async function loginUser(req, res) {
  try {
    const { UserName, password } = req.body;
    if (!req.body.UserName || !req.body.password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    console.log(UserName);
    const user = await User.find({ username: UserName });
    console.log("This is the user console" + user);
    console.log("this is the user console with array" + user[0]);
    console.log("this is the userID " + user[0]._id);
    if (user[0] && await bcrypt.compare(password, user[0].password)) {
      const token = jwt.sign({ userid: user[0]._id }, SECRET_KEY, { expiresIn: '12h' });
      console.log(token);
      res.json({ message: 'Login successful', token });
      console.log('Login successful');
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  }
  catch (err){
    res.status(500).json({message: `Error for status, ${err}`});
  }
}

export {registerUser, loginUser};