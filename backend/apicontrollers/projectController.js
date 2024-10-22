import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { generateQuestions } from './aiController.js';
import multer from 'multer';
import { uploadFile } from './getfile.js';
import path from 'path';
import { sendEmailToProjectMembers } from '../middleware/emailService.js';
import Question from '../models/Question.js';
import { get } from 'http';
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
    if (studygroup == '') {
        project.studygroup = null;
    }
    try {
        await project.save();
        res.status(201).send(project);
    } catch (err) {
        res.status(400).send(`request failed: ${err}`);
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
    } catch (err) {
        res.status(500).send(err);
    }
})
projectController.post('/generateQuestions', upload.fields([{ name: 'project' }, { name: 'file' }, { name: 'title' }]), authenticateToken, async (req, res) => {
    try {
        const { project, title } = req.body;
        const { file } = req.files;
        if (!file || !project) {
            return res.status(400).send('Please upload a file and project');
        }
        const newProject = await Project.findById({ _id: project });
        console.log(newProject)
        const questions = await uploadFile(file[0])
            .then(async (file) => { return await generateQuestions(file.filePath, newProject.NumberofQuestions); })
            .then(async (questions) => {
                console.log(questions);
                const questionDocs = await Promise.all(questions.map(async (question) => {
                    const newQuestion = new Question({
                        text: question.text,
                        choices: question.choices,
                        answer: question.answer,
                        id: question.id
                    });
                    await newQuestion.save();
                    console.log(newQuestion._id);
                    return newQuestion._id; // Return the ID of the saved question
                }));
                console.log(questionDocs);
                newProject.Questions.push({ Name: title, Questions: questionDocs})
                await newProject.save()
                return "Success"
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
        return res.status(201).send(`${questions}`);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

projectController.put('/update/:id', authenticateToken, async (req, res) => {
    const { name, description, studygroup, emailFrequency, NumberofQuestions } = req.body;

    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, creator: req.userid },
            { name, description, studygroup, emailFrequency, NumberofQuestions },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).send('Project not found or unauthorized');
        }

        res.send(project);
    } catch (err) {
        res.status(400).send(err);
    }
});
projectController.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, creator: req.userid });

        if (!project) {
            return res.status(404).send('Project not found or unauthorized');
        }

        res.send(`Project "${project.name}" has been deleted`);
    } catch (err) {
        res.status(500).send(err);
    }
});

projectController.post('/sendEmails/:id', async (req, res) => {
    const { id } = req.params;
    const frontendUrl = `http://localhost:3000/questions`;
    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).send('Project not found');
        }
        const { members, emailFrequency } = project;
        for (const member of members) {
            const { Email, Name } = member;
            const projectLink = `${frontendUrl}?email=${Email}&name=${encodeURIComponent(Name)}&project=${id}`;
            await sendEmailToProjectMembers(Email, Name, projectLink, emailFrequency);
        }
        res.status(200).send('Emails sent successfully to all project members');
    } catch (err) {
        console.error(`Error sending emails: ${err}`);
        res.status(500).send('An error occurred while sending emails');
    }
});
///Get 5 random questions from the project 
projectController.get('/getQuestions/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        const questions = project.Questions[project.Questions.length - 1];
        const randomQuestions = [];
        const getQuestions = await Question.find({ _id: { $in: questions.Questions } });
        for (let i = 0; i < 5; i++) {
            randomQuestions.push(questions[Math.floor(Math.random() * questions.length)]);
        }
        res.send(getQuestions);
    } catch (err) {
        console.error(`Error getting questions: ${err}`);
        res.status(500).send(err);
    }
}
)
projectController.post('/addMembers/:id', authenticateToken, async (req, res) => {
    const { members } = req.body;
    console.log(members);
    if (!members || !Array.isArray(members)) {
        return res.status(400).send('Please provide an array of members with Name and Email.');
    }

    try {
        const project = await Project.findOne({ _id: req.params.id, creator: req.userid });

        if (!project) {
            return res.status(404).send('Project not found or unauthorized.');
        }
        project.members.push(...members);

        await project.save();

        res.status(200).send(`Members added successfully: ${members.map(member => member.Name).join(', ')}`);
    } catch (err) {
        console.error(`Error adding members: ${err}`);
        res.status(500).send('An error occurred while adding members.');
    }
});
///Remove members from the project
projectController.post('/removeMembers/:id', authenticateToken, async (req, res) => {
    const { members } = req.body;
    if (!members || !Array.isArray(members)) {
        return res.status(400).send('Please provide an array of members with Name and Email.');
    }

    try {
        const project = await Project.findOne({ _id: req.params.id, creator: req.userid });

        if (!project) {
            return res.status(404).send('Project not found or unauthorized.');
        }

        project.members = project.members.filter(member => !members.some(m => m.Email === member.Email));

        await project.save();

        res.status(200).send(`Members removed successfully: ${members.map(member => member.Name).join(', ')}`);
    } catch (err) {
        console.error(`Error removing members: ${err}`);
        res.status(500).send('An error occurred while removing members.');
    }
});




export default projectController;