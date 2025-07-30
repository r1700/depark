// Mock Database פשוט למגבלת חניות

class MockParkingLimitDB {
  constructor() {
    this.data = {
      maxParkingSpots: 25, // 👈 המגבלה הנוכחית (ניתן לשינוי)
      updatedAt: new Date('2024-01-15T10:30:00'),
      updatedBy: 'system'
    };
  }

  // קבל מגבלת חניות
  async getMaxParkingSpots() {
    console.log('🗄️ MockDB: Getting parking spots limit...');
    
    // סימולציה של השהייה (כמו DB אמיתי)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      maxSpots: this.data.maxParkingSpots,
      updatedAt: this.data.updatedAt,
      updatedBy: this.data.updatedBy
    };
  }

  // עדכן מגבלת חניות (רק אדמין)
  async updateMaxParkingSpots(newLimit) {
    console.log(`🔧 MockDB: Updating max parking spots limit to ${newLimit}...`);
    
    // סימולציה של השהייה
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (newLimit < 1) {
      return {
        success: false,
        error: 'Maximum spots must be at least 1'
      };
    }
    
    this.data.maxParkingSpots = newLimit;
    this.data.updatedAt = new Date();
    this.data.updatedBy = 'admin';
    
    return {
      success: true,
      newLimit,
      updatedAt: this.data.updatedAt,
      message: `Maximum parking spots updated to ${newLimit}`
    };
  }
}

// יצירת instance יחיד
const mockParkingLimitDB = new MockParkingLimitDB();

module.exports = mockParkingLimitDB;