import express from 'express';
import { Project } from '../models/Project';

import { authenticateToken } from '../middleware/authenticateToken';

const projectController = express.Router();

projectController.post('/create', authenticateToken, async (req, res) => {
    const { name, description, studygroup, emailFrequency, NumberofQuestions } = req.body;
    const creator = req.user._id;
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
        res.status(400).send(err);
    }
});

projectController.get('/get', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user._id });
        res.send(projects);
    } catch (err) {
        res.status(500).send(err);
    }
});

projectController.get('/get/:studygroup', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ studygroup: req.params.studygroup });
        res.send(projects);
    } catch (err) {
        res.status(500).send(err);
    }
});

projectController.get('/get/:user', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.params.user });
        res.send(projects);
    } catch (err) {
        res.status(500).send(err);
    }
})

projectController.post('/addmember', authenticateToken, async (req, res) => {
    const { project, member } = req.body;
    try {
        const newProject = await Project.findById(project);
        newProject.members.push(member);
        await newProject.save();
        res.send(newProject);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

projectController.post('/removemember', authenticateToken, async (req, res) => {
    const { project, member } = req.body;
    try {
        const newProject = await Project.findById(project);
        newProject.members = newProject.members.filter(m => m != member);
        await newProject.save();
        res.send(newProject);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

projectController.post('/generateQuestions', authenticateToken, async (req, res) => {
    const { project, file } = req.body;
    try {
        const upload = await uploadFile();
        const newProject = await Project.findById(project);
        const questions = newProject.generateQuestions();
        newProject.questions = questions;
        await newProject.save();
        res.send("success");
    } catch (err) {
        res
            .status(500)
            .send(err);
    }});