  import express  from 'express';
  import mongoose from 'mongoose'
  import openaiRouter from './routes/openAIprocessing/aiRouter.js'
  import ProcessaiFile from './apicontrollers/aiProcessing.js';
  const app = express()
  const port = 3000

  mongoose.connect('mongodb://localhost:27017/StudyEngine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  app.use('/api', openaiRouter)
  app.get('/', (req, res) => {
    res.send('Simple Study Engine API')
  })
  app.listen(port, () => {
    console.log(``)
  })  