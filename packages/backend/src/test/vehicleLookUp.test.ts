
import { 
  isLicensePlateExists,
  isParkingLotActive,
  isUserAuthorizedNow,
  isParkingAvailableForSize,
  isLotFull
} from './parkingService';

describe('Parking Service Tests', () => {
  beforeAll(async () => {
    // אתחול משאבים פעם אחת
    console.log('חיבור ל־DB או הכנת Mock');
  });

  afterAll(async () => {
    // ניקוי משאבים פעם אחת
    console.log('סגירת DB או ניקוי Mock');
  });

  beforeEach(() => {
    // ריצה לפני כל טסט
    console.log('אתחול מצב לפני טסט');
  });

  afterEach(() => {
    // ריצה אחרי כל טסט
    console.log('ניקוי מצב אחרי טסט');
  });
  describe('לוחית רישוי/בדיקת מספר רישוי', () => {

        test('מספר רישוי לא נמצא', async () => {
            const exists = await isLicensePlateExists('NOT_EXIST');
            expect(exists).toBe(false);
        });
        test('מספר קצר מידי, לא תקין', async () => {
            const exists = await isLicensePlateExists('123');

            expect(exists).toBe(false);
        });
        test('מספר רישוי ריק', async () => {
            const exists = await isLicensePlateExists('');
            expect(exists).toBe(false);
        });
        test('License number is null', async () => {
            const exists = await isLicensePlateExists(null);
            expect(exists).toBe(false);
        });
        test('לוחית עם רווחים מיותרים', async () => {
            const exists = await isLicensePlateExists(' 1234 56789 ');
            expect(exists).toBe(false);
        });
         test('   מספר רישוי כבר קיים בחניון', async () => {
        const exists = await isLicensePlateExists('987654321');
        expect(exists).toBe(false);
        });
        test('מספר רישוי תקין', async () => {
            const exists = await isLicensePlateExists('123456789');
            expect(exists).toBe(true);
        });
         test('לא ניתן לקרוא לוחית רישוי', async () => {
            const exists = await isLicensePlateExists('INVALID_PLATE');
            expect(exists).toBe(false);
         });
  });
  describe('חניון לא פעיל', () => {
        test('תאריך שגוי', async () => {
        const active = await isParkingLotActive("00/00/0000");
        expect(active).toBe(false);
        });
        test('תאריך לא נכון', async () => {
        const active = await isParkingLotActive("40/02/2025");
        expect(active).toBe(false);
        })
        test('אין תאריך', async () => {
        const active = await isParkingLotActive("");
        expect(active).toBe(false);
        })
        test('חניון לא פעיל מחזיר false', async () => {
        const active = await isParkingLotActive("00/00/0000");
        expect(active).toBe(false);
        })
  })
  describe('בדיקת הרשאות משתמש', () => {//userId
    test('משתמש לא מורשה', async () => {
      const authorized = await isUserAuthorizedNow('111111111');
      expect(authorized).toBe(false);
    });

    test('משתמש מורשה', async () => {
      const authorized = await isUserAuthorizedNow('123456789'); // משתמש מורשה
      expect(authorized).toBe(true);
    });
    test('משתמש לא קיים', async () => {
      const authorized = await isUserAuthorizedNow('000000000');
      expect(authorized).toBe(false);
    });
    test('משתמש לא פעיל', async () => {
      const authorized = await isUserAuthorizedNow('2222222');
      expect(authorized).toBe(false);
    });
    test('משתמש חסום', async () => {
      const authorized = await isUserAuthorizedNow('1234');
      expect(authorized).toBe(false);
    }); 
});

describe('בדיקת מקום בחניון בגודל מתאים', () => {

   test('יש מקום בגודל מתאים', async () => {
       const available = await isParkingAvailableForSize({
           height: 10,
           width:  10,
           length: 10,
           weight: 10
       }); // גודל תקין
       expect(available).toBe(true);
   });
   test('אין מידע מספק על גודל רכב', async () => {
       const available = await isParkingAvailableForSize({
           height: null,
           width:  10,
           length: 10,
           weight: 10
       });
       expect(available).toBe(false);
   });

   test('אין מקום בגודל מתאים', async () => {
       const available = await isParkingAvailableForSize({
           height: 100,
           width:  100,
           length: 100,
           weight: 100
       });
       expect(available).toBe(false);
   });
   test('חסרים נתונים', async () => {
       const available = await isParkingAvailableForSize({
           height: 100,
           width:  100,
           
       });
       expect(available).toBe(false);
   });
    test(' נתונים לא תואמים לtype', async () => {
        const available = await isParkingAvailableForSize({
            height: "100",
            width:  "מאה",
            length: "מאה",
            weight: "מאה"
        });
        expect(available).toBe(false);
    });  
    test(' נתונים  תואמים לtype', async () => {
        const available = await isParkingAvailableForSize({
            height: 100,
            width:  20.3,
            length: 4.2,
            weight: 70.3
        });
        expect(available).toBe(true);
    });
     test(' אין ערכים שלילים', async () => {
        const available = await isParkingAvailableForSize({
            height: -100,
            width: -20.3,
            length: -4.2,
            weight: -70.3
        });
        expect(available).toBe(false);
   }); 
     test(' אין ערכים שלילים', async () => {
        const available = await isParkingAvailableForSize({
            height: -100,
            width: -20.3,
            length: -4.2,
            weight: -70.3
        });
        expect(available).toBe(false);
   }); 
      test(' אין ערכים שלילים', async () => {
        const available = await isParkingAvailableForSize({
            height: -100,
            width: -20.3,
            length: -4.2,
            weight: -70.3
        });
        expect(available).toBe(false);
   });

   test('אין מקום בחניון', async () => {
       const full = await isLotFull();
       expect(full).toBe(true);
   });
   
});







    test('יש מקום בגודל מתאים', async () => {
        const available = await isParkingAvailableForSize('SMALL');
        expect(available).toBe(true);
    });

  test('אין מקום בגודל מתאים', async () => {
    const available = await isParkingAvailableForSize('LARGE');
    expect(available).toBe(false);
  });

  test('אין מקום בחניון', async () => {
    const full = await isLotFull();
    expect(full).toBe(true);
  });
});
