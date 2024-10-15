import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
  tls: {
    rejectUnauthorized: false, // Allow invalid certificates (not recommended for production)
  },
});
export const sendmail = async (tomail, subject, body) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: tomail,
      subject: subject,
      html: body,
    });
    return info;
  } catch (error) {
    console.error("Error while sending email:", error);
  }
};
