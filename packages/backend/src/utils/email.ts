export const sendResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  // לעת עתה - רק לוג מדומה
  console.log('🎯 ========== PASSWORD RESET EMAIL ==========');
  console.log(`📧 נשלח אימייל איפוס סיסמה ל: ${email}`);
  console.log(`🔗 קישור איפוס: ${resetUrl}`);
  console.log('✅ אימייל "נשלח" בהצלחה (דמה)');
  console.log('===============================================');
  
  // אם תרצה להוסיף אימייל אמיתי בעתיד:
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // כאן תוסיף קוד שליחת אימייל אמיתי (nodemailer וכו')
    console.log('💡 Email settings found - would send real email here');
  } else {
    console.log('📧 Using mock email - real email settings not configured');
  }
  
  return Promise.resolve();
};