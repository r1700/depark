
// // בס"ד

// // בונה סטרינג לשליחה ל-PLC
// export function buildQueueRequestString(elevatorId: string, floor: string): string {
//   return `GET_QUEUE|${elevatorId}|${floor}`;
// }

// // מחזיר nodeId לניטור לפי מזהה המעלית
// export function getQueueNodeId(elevatorId: string): string {
//   return `ns=2;s=Elevators/${elevatorId}/Queue`;
// }

// // מפרש את מה שה-PLC מחזיר למבנה אחיד
// export function parseQueueFromPlcValue(rawValue: any): Array<{ licensePlate: string, position: number, estimatedRetrievalTime: number }> {
//   if (!rawValue) return [];

//   let parsed: any;

//   if (typeof rawValue === 'string') {
//     try {
//       parsed = JSON.parse(rawValue);
//     } catch {
//       // fallback: מפרק סטרינג בפורמט LP:xxx|POS:1|ET:5;...
//       return rawValue.split(';').map((entry: string) => {
//         const parts = entry.split('|');
//         const obj: any = {};
//         parts.forEach(p => {
//           const [key, val] = p.split(':');
//           obj[key] = val;
//         });
//         return {
//           licensePlate: obj['LP'] || '',
//           position: Number(obj['POS']) || 0,
//           estimatedRetrievalTime: Number(obj['ET']) || (Number(obj['POS']) * 5)
//         };
//       });
//     }
//   } else {
//     parsed = rawValue;
//   }

//   if (parsed?.cars) return parsed.cars;
//   if (Array.isArray(parsed)) return parsed;

//   return [];
// }



// פונקציות עזר לפירוש נתוני PLC

/**
 * בונה סטרינג שנשלח ל־PLC עם מזהה מעלית + קומה
 */
export function buildQueueRequestString(elevatorId: string, floor: string): string {
  return `${elevatorId}|${floor}`;
}

/**
 * מחזיר nodeId של התור למעלית מסוימת
 */
export function getQueueNodeId(elevatorId: string): string {
  return `ns=1;s=Queue_${elevatorId}`;
}

/**
 * ממיר ערך גולמי מה־PLC לאובייקטים עם רכבים
 * דוגמה קלט: "1234567:1;7654321:2"
 */
export function parseQueueFromPlcValue(rawValue: any): any[] {
  if (!rawValue) return [];

  try {
    return String(rawValue)
      .split(";")
      .filter(Boolean)
      .map((item, i) => {
        const [licensePlate, pos] = item.split(":");
        return {
          licensePlate,
          position: Number(pos || i + 1),
          estimatedRetrievalTime: (Number(pos || i + 1)) * 5 // 5 שניות לכל שלב לדוגמה
        };
      });
  } catch (e) {
    console.error("Failed to parse PLC value:", e);
    return [];
  }
}
