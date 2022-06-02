import nodemailer from 'nodemailer';
import dotenv from 'dotenv/config';

const transporter = nodemailer.createTransport({
   host: "smtp.ethereal.email",
   port: 587,
   secure: false,
   auth: {
      user: process.env['EMAIL_NAME'],
      pass: process.env['EMAIL_PASSWORD'],
   },
});

export const sendPasswordResetEmail = async (email, url) => {
   const mailOptions = await transporter.sendMail({
      from: '"Malevich 👻" <foo@example.com>',
      to: email,
      subject: `Відновлення пароля.`,
      html: `<div style="font-size: 1.4em;"><h2>Привіт!</i></h2>
      <p>Ми отримали запит на відновлення пароля.</p><p>Щоб скинути пароль, 
      будь ласка, перейдіть по цьому посиланню: <a href="${url}">посилання</a></p>
      <p>Якщо цей запит робили не ви, або ж взагалі не бажаєте відновлювати пароль - 
      просто проігноруйте цей лист.</p></div>`
   });

   console.log("Message sent: %s", mailOptions.messageId);

   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailOptions));
}