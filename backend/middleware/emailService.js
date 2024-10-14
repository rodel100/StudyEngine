import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS}})

export const sendEmailToProjectMembers = async (email, name, projectLink, emailFrequency) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject:  `${emailFrequency} Quiz`,
            html: `
                <h1>Hello ${name},</h1>
                <p>You have a ${emailFrequency} quiz to complete.</p>
                <a href="${projectLink}">Access the project</a>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
};