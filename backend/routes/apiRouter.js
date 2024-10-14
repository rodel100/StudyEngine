import express from 'express';
var router = express.Router();
import {getFile, uploadFile} from '../apicontrollers/getfile.js';
import {generateQuestions} from '../apicontrollers/aiController.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const upload = multer({ storage: storage })

router.post('/uploadFile', upload.single('file') ,uploadFile);
router.get('/getfile', getFile);
router.get('/getQuestions', generateQuestions);

export default router;
