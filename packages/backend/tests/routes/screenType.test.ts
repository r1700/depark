import request from 'supertest';
import express from 'express';
import screenTypeRouter from '../../../backend/src/routes/screenType';
import { ScreenType } from '../../../backend/src/model/database-models/screentype.model';
import { Logo } from '../../../backend/src/model/database-models/logo.model';
import ScreenTypeLogo from '../../../backend/src/model/database-models/screentypelogo.model';

const app = express();
app.use(express.json());
app.use('/api/screentypes', screenTypeRouter);

const testScreenType = 'CRM'; // שם חוקי לפי המודל
let screenTypeId: number;
let logoId1: number;
let logoId2: number;

describe('ScreenType API', () => {
  it('should return 500 and details as string if DB error occurs when assigning logos (string error)', async () => {
    const spy = jest.spyOn(ScreenTypeLogo, 'destroy').mockImplementation(() => { throw "DB error string"; });
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: [logoId1] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to assign logos to screen type');
    expect(res.body.details).toBe('DB error string');
    spy.mockRestore();
  });
  it('should return 404 and received for non-existing screen type on POST (mock null)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => Promise.resolve(null));
    const res = await request(app)
      .post('/api/screentypes/NOT_EXIST/logos')
      .send({ logoIds: [123] });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('ScreenType not found');
    expect(res.body.received).toBe('NOT_EXIST');
    spy.mockRestore();
  });

  it('should return 404 for non-existing screen type on DELETE (mock null)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => Promise.resolve(null));
    const res = await request(app)
      .delete(`/api/screentypes/NOT_EXIST/logos/123`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('ScreenType not found');
    spy.mockRestore();
  });

  it('should return 404 for non-existing screen type on GET logos (mock null)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => Promise.resolve(null));
    const res = await request(app)
      .get('/api/screentypes/NOT_EXIST/logos');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('ScreenType not found');
    spy.mockRestore();
  });

  it('should return 400 and received for invalid logoIds array', async () => {
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: 'not-an-array' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('logoIds must be an array');
    expect(res.body.received).toBe('not-an-array');
  });

  it('should return 500 if DB error occurs when getting all screen types', async () => {
    const spy = jest.spyOn(ScreenType, 'findAll').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app).get('/api/screentypes');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch screen types');
    spy.mockRestore();
  });
  it('should return 500 if DB error occurs when getting logos (ScreenType)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app).get(`/api/screentypes/${testScreenType}/logos`);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch logos for screen type');
    spy.mockRestore();
  });

  it('should return 500 if DB error occurs when assigning logos (ScreenType)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: [logoId1] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to assign logos to screen type');
    expect(res.body.details).toBe('DB error');
    spy.mockRestore();
  });

  it('should return 500 if DB error occurs when removing logo (ScreenType)', async () => {
    const spy = jest.spyOn(ScreenType, 'findOne').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app)
      .delete(`/api/screentypes/${testScreenType}/logos/${logoId1}`);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to remove logo from screen type');
    spy.mockRestore();
  });

  it('should return 500 if DB error occurs when getting logos', async () => {
    // נניח ש-ScreenTypeLogo.findAll זורק שגיאה
    const spy = jest.spyOn(ScreenTypeLogo, 'findAll').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app).get(`/api/screentypes/${testScreenType}/logos`);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch logos for screen type');
    spy.mockRestore();
  });

  it('should return 500 if DB error occurs when assigning logos', async () => {
    // נניח ש-ScreenTypeLogo.destroy זורק שגיאה
    const spy = jest.spyOn(ScreenTypeLogo, 'destroy').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: [logoId2] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to assign logos to screen type');
    expect(res.body.details).toBe('DB error');
    spy.mockRestore();
  });

  it('should return 500 if DB error occurs when removing logo', async () => {
    // נניח ש-ScreenTypeLogo.destroy זורק שגיאה
    const spy = jest.spyOn(ScreenTypeLogo, 'destroy').mockImplementation(() => { throw new Error('DB error'); });
    const res = await request(app)
      .delete(`/api/screentypes/${testScreenType}/logos/${logoId2}`);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to remove logo from screen type');
    spy.mockRestore();
  });

  beforeAll(async () => {
    // בדוק אם קיים ScreenType כזה, ואם כן השתמש בו
    let screenType = await ScreenType.findOne({ where: { name: testScreenType } });
    if (!screenType) {
      screenType = await ScreenType.create({ name: testScreenType });
    }
    screenTypeId = screenType.id;
    const logo1 = await Logo.create({ logoUrl: '/logos/mock1.png', updatedBy: 'MOCK' });
    const logo2 = await Logo.create({ logoUrl: '/logos/mock2.png', updatedBy: 'MOCK' });
    logoId1 = logo1.id;
    logoId2 = logo2.id;
  });
});

  // ...existing code...

  it('should get all screen types', async () => {
    // שורה 13: בדיקת קבלת כל ה־screen types
    const res = await request(app).get('/api/screentypes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.screenTypes)).toBe(true);
    // בדוק שיש לפחות את ה־screenType שיצרנו
    expect(res.body.screenTypes.some((st: any) => st.name === testScreenType)).toBe(true);
  });

  it('should assign logos to a screen type', async () => {
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: [logoId1, logoId2] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.ignoredLogoIds)).toBe(true);
  });

  it('should get all logo IDs for a screen type', async () => {
    // שורה 25: בדיקת קבלת לוגואים ל־screenType קיים
    const res = await request(app)
      .get(`/api/screentypes/${testScreenType}/logos`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logoIds)).toBe(true);
    expect(res.body.logoIds).toContain(logoId1);
    expect(res.body.logoIds).toContain(logoId2);
  });

  it('should remove a logo from a screen type', async () => {
    // שורה 87: מחיקת לוגו מ־screenType קיים
    const res = await request(app)
      .delete(`/api/screentypes/${testScreenType}/logos/${logoId1}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // בדוק שהלוגו הוסר מה־ScreenTypeLogo
    const check = await ScreenTypeLogo.findOne({ where: { screenTypeId, logoId: logoId1 } });
    expect(check).toBeNull();
  });


  it('should return 400 for invalid logoIds array', async () => {
    // שורות 59-60: בדיקת קבלת 400 כאשר logoIds אינו מערך
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: 'not-an-array' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('logoIds must be an array');
    expect(res.body.received).toBe('not-an-array');
  });

  it('should ignore non-existing logoIds', async () => {
    const res = await request(app)
      .post(`/api/screentypes/${testScreenType}/logos`)
      .send({ logoIds: [logoId2, 999999] });
    expect(res.status).toBe(200);
    expect(res.body.ignoredLogoIds).toContain(999999);
  });
