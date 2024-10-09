import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';


const fileSchema = new mongoose.Schema({
    name: String,
    filePath: String
});

const File = mongoose.model('File', fileSchema);

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const file = new File({
            name: req.file.originalname,
            filePath: req.file.path
        });
        await file.save();
        res.send('File uploaded successfully!');
      } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
    }
};

async function getFile(req, res) {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found');
        }
        else {
            return file;
        }
    }
    catch (err) {
        console.error('Error retrieving file:', err);
        res.status(500).send('Error retrieving file');
    }
}

export {uploadFile, getFile}