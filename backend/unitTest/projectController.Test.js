import express, { request } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { Project } from '../models/Project';
import { app } from '../App';
import request from 'supertest';


describe('Project Controller', () => {
    afterAll(async (done) => {
        await Project.deleteMany({});
        app.listen().close(done);
    });
    it('should create a project', async () => {
        const response = await request(app)
            .post('/api/project/create')
            .send({
                name: 'Test Project',
                description: 'This is a test project',
                studygroup: '60e8f4d9c3d7e2f0f8e0e2b4',
                emailFrequency: 'daily',
                NumberofQuestions: 5
            })
            .set('Authorization' + process.env.TEST_TOKEN);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('Test Project');
    })
    it('should get all projects', async () => {
        const response = await request(app)
            .get('/api/project/get')
            .set('Authorization', +  process.env.TEST_TOKEN);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    })});