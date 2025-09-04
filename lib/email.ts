// mailer helper
import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string, html: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: html
    });

};