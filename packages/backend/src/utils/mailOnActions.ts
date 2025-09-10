import fs from 'fs';
import path from 'path';
const nodemailer = require('nodemailer');

export interface MailOptions {
    name: string;
    to: string;
    subject: string;
    html?: string;
}

export class MailService {
    private outputDir: string;

    constructor(outputDir = path.resolve(process.cwd(),'..', 'frontend', 'src','admin', 'app', 'pages','emails_out')) {
        this.outputDir = outputDir;
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    public async sendMail(options: MailOptions): Promise<void> {
        let htmlContent = options.html ?? ``;
      if (!htmlContent) {
            const templatesDir = path.resolve(process.cwd(),'..', 'frontend', 'src','admin', 'app', 'pages', 'sendMail');
            const templateFile = path.join(templatesDir, `${options.subject}.html`);
            
            try {
                htmlContent = await fs.promises.readFile(templateFile, 'utf-8');
            } catch (err) {
                console.warn(`Template file for subject '${options.subject}' not found, using default template.`);
            }
        }

        if (!htmlContent) {
            htmlContent = `
                <html>
                <body style="font-family:Ink Free, sans-serif; color: #0000CC;font-size: 30px;background-color: #f5f5f5db;">
                  <h1 style="color: #b6b6b6c5;font-family: Bookman Old Style">Hello {{name}}!!!</h1>
                  <p>?????</p>
                </body>
                </html>
            `;
        }

        htmlContent = htmlContent.replace(/{{name}}/g, options.name);
    

        if (process.env.NODE_ENV === 'production') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.GMAIL_APP_PASSWORD,
                to: options.to,
                subject: options.subject,
                html: htmlContent,
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent: ${info.response}`);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }

        else {
            const now = new Date();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timePart = `${hours}-${minutes}-${seconds}`;

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const datePart = `${day}_${month}_${year}`;

            const safeTo = options.to
            const safeSubject = options.subject.replace(/[^a-zA-Z0-9-_]/g, '');

            const filename = `${timePart} ${datePart} ${safeTo}_${safeSubject}.html`;
            const filepath = path.join(this.outputDir, filename);

            await fs.promises.writeFile(filepath, htmlContent, { encoding: 'utf-8' });
            console.log(`Email saved as HTML file:\n ${filepath}`);
        }
    }
}
