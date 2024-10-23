import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    jwt.verify(token, process.env.JSON_TOKEN_SECRET_KEY, (err, userid) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.userid = userid.userid;
        next();
    });
}