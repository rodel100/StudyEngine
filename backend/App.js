  import express  from 'express';
  import mongoose from 'mongoose'
  import authRouter from './routes/authRouter.js'
  import apiRouter from './routes/apiRouter.js'
  import 'dotenv/config';


  const app = express()
  const port = 8000
  app.use(express.json());
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next();
  });

  mongoose.connect('mongodb://localhost:27017/StudyEngine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  app.use('/auth', authRouter)
  app.use('/api', apiRouter)
  app.get('/', (req, res) => {
    res.send('Simple Study Engine API')
  })
  app.listen(port, () => {
    console.log(`It's on port ${port}`)
  })  