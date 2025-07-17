import request from 'supertest';
import app from '../services/app';  // יש להקפיד על ה-import של הקובץ שבו הגדרת את ה-API שלך

// jest.setTimeout(30000);  // הגברת הזמן המותר לכל בדיקה ל-30 שניות


// let server: any;  // הגדרת המשתנה server באופן גלובלי


// beforeAll((done) => {
//   // הפעלת השרת ושמירת הפנייה אליו
//   server = app.listen(3001, done);
// },10000);

// afterAll((done) => {
//   // סגירת השרת אחרי כל הבדיקות
//   if (server) {
//     server.close(() => {
//       done();  // סיום הבדיקה אחרי שהשרת נסגר
//     });
//   } else {
//     done();  // אם השרת לא הוקם, סיים את הבדיקה
//   }
// });


describe('GET /user/:id', () => {
  it('should return user details for a valid user ID', async () => {
    
    // דוגמת קריאה עם מזהה 1
    const response = await request(app).get('/user/1');
    
    // ודא שהסטטוס הוא 200
    expect(response.status).toBe(200);
    
    // ודא שהתשובה היא JSON
    expect(response.headers['content-type']).toContain('application/json');
    
    // ודא שהתשובה מכילה את המידע הצפוי
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(1);
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe('Jane Doe');
    expect(response.body).toHaveProperty('email');
    expect(response.body.email).toBe('jane.doe@example.com');
  });

  it('should return 404 for a non-existent user ID', async () => {
    // קריאה עם מזהה לא קיים
    const response = await request(app).get('/user/999');
    
    // ודא שהסטטוס הוא 404
    expect(response.status).toBe(404);
    
    // ודא שהתשובה מכילה את השגיאה הצפויה
    expect(response.body).toEqual({ error: 'User not found' });
  });
});
