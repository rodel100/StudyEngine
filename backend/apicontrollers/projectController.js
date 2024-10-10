import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { generateQuestions } from './aiController.js';
import multer from 'multer';
import { uploadFile } from './getfile.js';
import path from 'path';
const projectController = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const upload = multer({ storage: storage });


projectController.post('/create', authenticateToken, async (req, res) => {
    const { name, description, studygroup, emailFrequency, NumberofQuestions } = req.body;
    const creator = req.userid;
    const project = new Project({
        name,
        description,
        creator,
        studygroup,
        emailFrequency,
        NumberofQuestions
    });
    try {
        await project.save();
        res.status(201).send(project);
    } catch (err) {
        res.status(400).send(`req.body: ${req.userid}`);
    }
});

projectController.get('/get', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.userid });
        res.send(projects);
    } catch (err) {
        res.status(500).send(err);
    }
});

projectController.get('/get/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.send(project);
    } catch(err){
        res.status(500).send(err);
    }
})
projectController.post('/generateQuestions', upload.fields([{ name: 'project' }, { name: 'file' }, {name: 'title'}]),authenticateToken, async (req, res) => {
    try {
        const { project, title } = req.body;
        const { file } = req.files;
        console.log(project)
        if(!file || !project){
            return res.status(400).send('Please upload a file and project');
        }
        const newProject = await Project.findById({ _id: project });
        const questions = await uploadFile(file[0])
        .then(async (file) => {return await generateQuestions(file.filePath, newProject.NumberofQuestions);})
        .then(async (questions) => {
            console.log(questions);
            newProject.Questions.push({Name: title, Question: questions})
            await newProject.save()
            return 'success'
        })
        .catch((err) => {console.log(err);
            return err;
        });
        return res.status(201).send(`${questions}`);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }});

export default projectController;