import express from 'express';
import mongoose from 'mongoose';
import projectController from './apicontrollers/projectController.js';
import studyGroupController from './apicontrollers/studyGroupController.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authController from './apicontrollers/Authentication/authController.js';
import os from 'os';
dotenv.config();

const app = express();
const port = process.env.port || 8000;

// Use cors middleware
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000', // Specify the allowed origin
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Local MongoDB connection
mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://localhost:27017/StudyEngine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/// Azure CosmosDB connection (uncomment when using Azure)
// mongoose.connect("mongodb://" + process.env.COSMOSDB_HOST + ":" + process.env.COSMOSDB_PORT + "/" + process.env.COSMOSDB_DBNAME + "?ssl=true&replicaSet=globaldb", {
//   auth: {
//     username: process.env.COSMOSDB_USER,
//     password: process.env.COSMOSDB_PASSWORD
//   },
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   retryWrites: false
// })
//   .then(() => console.log('Connection to CosmosDB successful'))
//   .catch((err) => console.error(err));

// Set up routers
app.use('/auth', authController);
app.use('/api/project', projectController);
app.use('/api/studygroup', studyGroupController);

app.get('/', (req, res) => {
  res.send('Simple Study Engine API');
});

// Start the server
app.listen(port, () => {
  if(process.env.PORT){
    console.log(`Server running on port ${process.env.PORT}`);
  }
  console.log(`Server running on port ${port}`);
});

export { app };