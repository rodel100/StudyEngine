import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import StudyGroup from '../models/StudyGroup.js';
import Project from '../models/Project.js';
import { sendEmailtoStudyGroup } from '../middleware/emailService.js';


const studyGroupController = express.Router();

// Create a new study group
studyGroupController.post('/create', authenticateToken, async (req, res) => {
    const { name, projects } = req.body;
    const creator = req.userid
    const findProjects = await Project.find({ _id: { $in: projects } });
    console.log(projects)
    console.log(findProjects)
    try {
        const studyGroup = new StudyGroup({
            creator,
            name,
            projects: findProjects.map(project => project._id)
        });

        await studyGroup.save();
        res.status(201).send(studyGroup);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Get all study groups for the logged-in user
studyGroupController.get('/get', authenticateToken, async (req, res) => {
    try {
        const studyGroups = await StudyGroup.find({ creator: req.userid }).populate('projects');
        res.send(studyGroups);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a specific study group by ID
studyGroupController.get('/:id', authenticateToken, async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id).populate('projects');
        if (!studyGroup) return res.status(404).send('Study Group not found');
        res.send(studyGroup);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a study group
studyGroupController.put('/:id/update', authenticateToken, async (req, res) => {
    try {
        const { name, projects, scores } = req.body;
        const updatedStudyGroup = await StudyGroup.findByIdAndUpdate(
            req.params.id,
            { name, projects, scores },
            { new: true }
        );

        if (!updatedStudyGroup) return res.status(404).send('Study Group not found');
        res.send(updatedStudyGroup);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a study group
studyGroupController.delete('/:id/delete', authenticateToken, async (req, res) => {
    try {
        const deletedStudyGroup = await StudyGroup.findByIdAndDelete(req.params.id);
        if (!deletedStudyGroup) return res.status(404).send('Study Group not found');
        res.send(deletedStudyGroup);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add or update scores for a study group
studyGroupController.post('/:id/addscores', authenticateToken, async (req, res) => {
    const { scores } = req.body;

    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) return res.status(404).send('Study Group not found');

        // Merge or update scores
        scores.forEach((newScore) => {
            const existingScore = studyGroup.scores.find(score => score.email === newScore.email);
            if (existingScore) {
                existingScore.score = newScore.score; // Update score
            } else {
                studyGroup.scores.push(newScore); // Add new score
            }
        });

        await studyGroup.save();
        res.send(studyGroup);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Leaderboard for a study group
studyGroupController.get('/:id/leaderboard', authenticateToken, async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) return res.status(404).send('Study Group not found');

        // Sort scores by score in descending order
        const leaderboard = studyGroup.scores.sort((a, b) => b.score - a.score);
        res.send(leaderboard);
    } catch (err) {
        res.status(500).send(err);
    }
});
//Add Member to Study Group
studyGroupController.post('/addmember/:id', authenticateToken, async (req, res) => {
    const { name, email } = req.body;
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) return res.status(404).send('Study Group not found');
        studyGroup.members.push({ name, email });
        await studyGroup.save();
        res.send(studyGroup);
    } catch (err) {
        res.status(500).send(err);
    }
});

studyGroupController.post('/sendemails/:id', async (req, res) => {
    const { id } = req.params;
    const frontendUrl = `http://localhost:3000/studygroup-questions`;

    try {
        // Find the study group by ID
        const studyGroup = await StudyGroup.findById(id).populate('projects');

        if (!studyGroup) {
            return res.status(404).send('Study group not found');
        }

        const { members, projects } = studyGroup;

        // Loop through each member in the study group
        for (const member of members) {
            const { email, name } = member;

            
            let projectLinks = '';
            for (const project of projects) {
                const projectLink = `${frontendUrl}?email=${email}&name=${encodeURIComponent(name)}&project=${project._id}&studygroup=${id}`;
                projectLinks += `<li><a href="${projectLink}">${project.name} Quiz</a></li>`;
            }
            const emailContent = `
                <h1>Hello ${name},</h1>
                <p>You have quizzes to complete for the following projects:</p>
                <ul>${projectLinks}</ul>
            `;
           
            await sendEmailtoStudyGroup(email, name, emailContent, 'Weekly');
        }

        res.status(200).send('Emails sent successfully to all study group members');
    } catch (err) {
        console.error(`Error sending emails: ${err}`);
        res.status(500).send('An error occurred while sending emails');
    }
});
    

export default studyGroupController;
