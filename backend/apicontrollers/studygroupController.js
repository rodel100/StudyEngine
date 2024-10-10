import { StudyGroup } from "../models/StudyGroup";
import express from 'express';

import { authenticateToken } from '../middleware/authenticateToken';

const studyGroupController = express.Router();

studyGroupController.post('/create', authenticateToken, async (req, res) => {
    const { name, description, members } = req.body;
    const creator = req.user._id;
    const studyGroup = new StudyGroup({
        name,
        description,
        creator,
        members
    });
    try {
        await studyGroup.save();
        res.status(201).send(studyGroup);
    } catch (err) {
        res.status(400).send(err);
    }
});

studyGroupController.get('/get', authenticateToken, async (req, res) => {
    try {
        const studyGroups = await StudyGroup.find({ creator: req.user._id });
        res.send(studyGroups);
    } catch (err) {
        res.status(500).send(err);
    }
});

studyGroupController.get('/get/:user', authenticateToken, async (req, res) => {
    try {
        const studyGroups = await StudyGroup.find({ members: req.params.user });
        res.send(studyGroups);
    } catch (err) {
        res.status(500).send(err);
    }
});

studyGroupController.post('/addmember', authenticateToken, async (req, res) => {
    const { studygroup, member } = req.body;
    try {
        const newStudyGroup = await StudyGroup.findById(studygroup);
        newStudyGroup.members.push(member);
        await newStudyGroup.save();
        res.send(newStudyGroup);
    } catch (err) {
        res.status(500 ).send(err);
    }
});

export { studyGroupController }