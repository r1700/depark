export const statusToNumber = (status: string): number => {
  switch (status) {
    case "pending": return 0;
    case "approved": return 1;
    case "declined": return 2;
    case "suspended": return 3;
    default: return 0;
  }
};

export const numberToStatus = (num: number): string => {
  switch (num) {
    case 0: return "pending";
    case 1: return "approved";
    case 2: return "declined";
    case 3: return "suspended";
    default: return "-";
  }
};
