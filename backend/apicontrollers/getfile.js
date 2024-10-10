import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: String,
    filePath: String
});

const File = mongoose.model('File', fileSchema);
async function uploadFile(file) {
    try {
        if (!file) {
            return 'No file uploaded';
            console.log('No file uploaded');
        }
        const newFile = new File({
            name: file.originalname,
            filePath: file.path
        });
        await newFile.save();
        return newFile;
      } catch (err) {
        return err;
    }
};

async function getFile() {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return 'file not found';
        }
        else {
            return file;
        }
    }
    catch (err) {
        return err;
    }
}

export {uploadFile, getFile}