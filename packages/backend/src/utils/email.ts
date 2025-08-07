import nodemailer from 'nodemailer';

export const sendResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Depark Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Depark',
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request a reset, you can ignore this message.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to: ${email}`);
  } else {
    // Dummy mode - email settings not configured
    console.log('🎯 ========== PASSWORD RESET EMAIL ==========');
    console.log(`📧 Password reset email sent to: ${email}`);
    console.log(`🔗 Reset link: ${resetUrl}`);
    console.log('✅ "Email sent" successfully');
  }
};