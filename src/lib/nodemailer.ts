import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(
  email: string,
  subject: string,
  message: string,
  html?: string,
): Promise<void> {
  try {
    const mailOptions: MailOptions = {
      from: process.env.MAIL_FROM || 'default_email@example.com',
      to: email,
      subject: subject,
      text: message,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error(`Error to send e-mail: ${error}`);
  }
}
