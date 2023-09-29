import { NextApiRequest, NextApiResponse } from 'next';
import { recoverPasswordSchema } from '../../../schemas/RecoveryPassword';
import { sendEmail } from '../../../lib/nodemailer';
import apiHandler from '../../../middleware/apiHandler';
import prisma from '../../../prisma';
import jwt from 'jsonwebtoken';

function generateResetToken(accountId: number): string {
  const secretKey = process.env.JWT_SECRET_KEY || 'fallback-secret-key';

  const payload = { accountId };

  const options: jwt.SignOptions = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, secretKey, options);

  return token;
}

function generateResetEmail(resetLink: string): string {
  return `
  <!doctype html>
  <html lang="en-US">
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email Template.">
      <style type="text/css">
          a:hover {text-decoration: underline !important;}
      </style>
  </head>
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <p>Hello,</p>
      <p>You have requested to reset your password. Click the button below to continue:</p>
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="font-family: 'Open Sans', sans-serif;">
      <tr>
          <td>
              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                  <tr><td style="height:80px;">&nbsp;</td></tr>
                  <tr>
                      <td style="text-align:center;">
                        <a href="https://shibaac.vercel.app" title="logo" target="_blank">
                          <img width="60" src="https://shibaac.vercel.app/images/header.png" title="logo" alt="logo">
                        </a>
                      </td>
                  </tr>
                  <tr><td style="height:20px;">&nbsp;</td></tr>
                  <tr>
                      <td>
                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                              <tr><td style="height:40px;">&nbsp;</td></tr>
                              <tr>
                                  <td style="padding:0 35px;">
                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">You have requested to reset your password</h1>
                                      <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                          We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.
                                      </p>
                                      <a href="${resetLink}" style="background:#805ad5;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a>
                                  </td>
                              </tr>
                              <tr><td style="height:40px;">&nbsp;</td></tr>
                          </table>
                      </td>
                  </tr>
                  <tr><td style="height:20px;">&nbsp;</td></tr>
                  <tr>
                      <td style="text-align:center;">
                        <p>If you did not request this, please ignore this email or contact support for assistance.</p>
                        <p>Best regards,<br>The shibaac Team</p>
                      </td>
                  </tr>
                  <tr><td style="height:80px;">&nbsp;</td></tr>
              </table>
          </td>
      </tr>
  </table>

  </body>
  </html>
  `;
}

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, characterName, accountName, recoveryKey, type } = req.body;

    await recoverPasswordSchema.validate(req.body);

    let account;

    switch (type) {
      case '1':
        account = await prisma.accounts.findFirst({
          where: {
            email: email,
            name: accountName,
          },
          include: {
            players: {
              where: { name: characterName },
            },
          },
        });
        break;

      case '2':
        account = await prisma.accounts.findUnique({
          where: { rec_key: recoveryKey },
        });
        break;

      case '3':
        account = await prisma.accounts.findFirst({
          where: {
            rec_key: recoveryKey,
            OR: [{ name: accountName }, { email: email }],
          },
        });

        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: 'Invalid recovery type.' });
    }

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'No account found with the provided details.',
      });
    }

    const resetToken = generateResetToken(account.id);

    await prisma.accounts.update({
      where: { email },
      data: { resetToken },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Click here to reset your password: ${resetLink}`;
    const html = generateResetEmail(resetLink);

    await sendEmail(email, subject, text, html);

    res.json({
      success: true,
      message: 'Password reset email sent successfully.',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error && error?.errors[0] });
  } finally {
    await prisma.$disconnect();
  }
};

export default apiHandler({
  post: post,
});
