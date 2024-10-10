import express from 'express';
var router = express.Router();
import {loginUser, registerUser} from '../apicontrollers/Authentication/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;