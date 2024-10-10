import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    jwt.verify(token, process.env.JSON_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
}