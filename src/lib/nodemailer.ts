import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'hotmail.com',
  auth: {
    user: 'your email',
    pass: 'password',
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(
  email: string,
  subject: string,
  message: string,
): Promise<void> {
  try {
    const mailOptions: MailOptions = {
      from: 'your email',
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error(`Erro ao enviar e-mail: ${error}`);
  }
}
