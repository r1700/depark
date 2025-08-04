FROM node:18

# הגדרת תיקיית עבודה
WORKDIR /usr/src/app

# העתקת קובצי התלויות בלבד
COPY package*.json ./

# התקנת התלויות
RUN npm install

# העתקת כל הקוד
COPY . .

# קומפילציה (אפשרי, אם משתמשים ב-TS build)
# RUN npm run build

# פקודת הפעלה עם ts-node (לשימוש בפיתוח) או הפעלת הקוד הממוקמץ
CMD ["npm", "run", "dev"]  
# או אם תרצה מעלים מפורשים: ["npx", "ts-node", "src/index.ts"]