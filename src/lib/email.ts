import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL || "christianretreatcentrelagos@gmail.com",
      pass: process.env.SMTP_PASSWORD, // Must be an App Password
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL || "christianretreatcentrelagos@gmail.com",
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
