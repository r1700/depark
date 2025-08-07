import { Router } from 'express';
import { MailService } from '../services/mailOnActions';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const mailService = new MailService();

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, text } = req.body;
        if (!name || !email || !subject || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const templatesDir = path.resolve(process.cwd(), 'frontend', 'src', 'app', 'pages', 'sendMail');

        const templateFile = path.join(templatesDir, `${subject}.html`);

        let htmlTemplate = '';
        try {
            htmlTemplate = await fs.readFile(templateFile, 'utf-8');
        } catch (err) {
            console.warn(`Template file for subject '${subject}' not found, using default template.`);
        }

        let htmlContent = htmlTemplate;
        if (!htmlContent) {
            htmlContent = `
                <html>
                <body style="font-family:Ink Free, sans-serif; color: #0000CC;font-size: 30px;background-color: #f5f5f5db;">
                  <h1 style="color: #b6b6b6c5;font-family: Bookman Old Style">Hello {{name}}!!!</h1>
                  <p>{{text}}</p>
                </body>
                </html>
            `;
        }

        htmlContent = htmlContent.replace(/{{name}}/g, name).replace(/{{text}}/g, text);

        await mailService.sendMail({ to: email, subject, text, name, html: htmlContent });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export default router;