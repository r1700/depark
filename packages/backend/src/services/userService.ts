import { User } from '../models/user'; // מודול User שלך
import { UserStatusEnum } from '../types/UserStatusEnum'; // טייפ סטטוס שלך

// עדכון סטטוס של משתמש
export async function updateUserStatus(userId: string, status: UserStatusEnum, adminId: string) {
  try {
    console.log("dddddddddddddddddd");
    
    // עדכון המשתמש
    const [numberOfAffectedRows, [updatedUser]] = await User.update(
      { 
        status,             // עדכון הסטטוס
        approvedBy: adminId, // עדכון מי אישר
        approvedAt: new Date(), // עדכון זמן האישור
      },
      {
        where: { id: userId }, // סעיף where לפי id של המשתמש
        returning: true,        // מחזיר את המשתמש המעודכן (בעיקר עבור PostgreSQL)
      }
      
    );

    // אם לא בוצע עדכון (אין שורות מעודכנות), זרוק שגיאה
    if (numberOfAffectedRows === 0) {
        console.log('xxxxxxxxxxxxxx');
        
      throw new Error('User not found');
    }

    // מחזיר את המשתמש המעודכן
    return updatedUser;

  } catch (error) {
    // אם קרתה שגיאה, זרוק אותה
    throw new Error('Failed to update user status');
  }
}