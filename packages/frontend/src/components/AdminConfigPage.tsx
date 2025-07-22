// AdminConfigPage.tsx
import React, { useState, useEffect } from 'react';

// טיפוסים זמניים (עד שתיצרי את קובץ הטיפוסים)
interface ParkingConfiguration {
  id: string;
  facilityName: string;
  timezone: string;
  totalSurfaceSpots: number;
  surfaceSpotIds: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  activeDays?: string[];
  maxQueueSize: number;
  avgRetrievalTimeMinutes: number;
  maxParallelRetrievals?: number;
  updatedAt: Date;
  updatedBy: string;
}

interface SystemSettings {
  maintenance_mode: boolean;
  show_admin_analytics: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export default function AdminConfigPage() {
  const [parkingConfig, setParkingConfig] = useState<ParkingConfiguration | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [rawSpotsText, setRawSpotsText] = useState(''); // הוסף state נוסף עבור הטקסט הגולמי
  const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // הוסף state עבור אינדיקטור עיבוד
  const [showAddSpot, setShowAddSpot] = useState(false); // הוסף state עבור תצוגת הוספת חניה חדשה
  const [newSpotId, setNewSpotId] = useState(''); // הוסף state עבור מזהה חניה חדשה
  const [maxSpotsLimit, setMaxSpotsLimit] = useState(3); // ← שנה ל-3
  const [isLimitLoading, setIsLimitLoading] = useState<boolean>(true); // הוסף state לטעינת המגבלה
  const [limitUpdatedAt, setLimitUpdatedAt] = useState<Date | null>(null); // הוסף state לזמן עדכון המגבלה

  // טעינת נתונים
  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (parkingConfig?.surfaceSpotIds) {
      setRawSpotsText(parkingConfig.surfaceSpotIds.join(', '));
    }
  }, [parkingConfig?.surfaceSpotIds]);

  // וודא שהקוד הזה קיים ועובד:
  useEffect(() => {
    const loadParkingLimit = async () => {
      try {
        console.log('🔄 Loading parking limit from database...');
        
        // 👈 פשוט קבע 3 ללא קריאה לשרת (כי השרת לא עובד)
        setMaxSpotsLimit(3);
        console.log(`✅ Set parking limit to: 3 spots`);
        
        /* הסתר זמנית כי השרת לא עובד:
        const response = await fetch('http://localhost:3001/api/parking-limit');
        const result = await response.json();
        
        if (result.success) {
          setMaxSpotsLimit(result.maxSpots);
          console.log(`✅ Loaded parking limit: ${result.maxSpots} spots`);
        }
        */
      } catch (error) {
        console.error('❌ Network error:', error);
        setMaxSpotsLimit(3); // fallback ל-3
      } finally {
        setIsLimitLoading(false);
      }
    };
    
    loadParkingLimit();
  }, []);

  const fetchConfig = async () => {
    try {
      // תמיד התחל עם קונפיגורציה ריקה, ללא קריאה לשרת
      setParkingConfig({
        id: '',
        facilityName: '',
        timezone: 'Asia/Jerusalem',
        totalSurfaceSpots: 0,
        surfaceSpotIds: [],
        operatingHours: {
          start: '',
          end: ''
        },
        activeDays: [],
        maxQueueSize: 0,
        avgRetrievalTimeMinutes: 0,
        updatedAt: new Date(),
        updatedBy: 'admin'
      });
      
      setSystemSettings({
        maintenance_mode: false,
        show_admin_analytics: false,
        updatedAt: new Date(),
        updatedBy: 'admin'
      });
      
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    setMessage(null);

    try {
      console.log('📤 Sending data to server...');
      
      // יצירת זמן חדש
      const currentTime = new Date();
      
      const response = await fetch('http://localhost:3001/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parkingConfig: {
            ...parkingConfig,
            updatedAt: currentTime,
            updatedBy: 'admin'
          },
          systemSettings: {
            ...systemSettings,
            updatedAt: currentTime,
            updatedBy: 'admin'
          }
        })
      });

      const data = await response.json();
      console.log('📥 Server response:', data);
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        
        // 👈 זה החלק החשוב - עדכון הזמן בstate המקומי!
        setParkingConfig(prev => ({
          ...prev!,
          updatedAt: currentTime, // זמן חדש יתעדכן בממשק מיד!
          updatedBy: 'admin'
        }));
        
        setSystemSettings(prev => ({
          ...prev!,
          updatedAt: currentTime, // זמן חדש יתעדכן בממשק מיד!
          updatedBy: 'admin'
        }));
        
        console.log('✅ Time updated successfully to:', currentTime.toLocaleString());
        
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      
      // גם במקרה של שגיאה - עדכן את הזמן כי השינויים נשמרו מקומית
      const currentTime = new Date();
      setParkingConfig(prev => ({
        ...prev!,
        updatedAt: currentTime,
        updatedBy: 'admin'
      }));
      
      setSystemSettings(prev => ({
        ...prev!,
        updatedAt: currentTime,
        updatedBy: 'admin'
      }));
      
      setMessage({ type: 'error', text: 'Error saving configuration (but time updated locally)' });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to empty values?')) {
      const currentTime = new Date(); // זמן חדש עבור האיפוס
    
      setParkingConfig(prev => prev ? {
        ...prev,
        id: '',
        facilityName: '',
        timezone: 'Asia/Jerusalem',
        totalSurfaceSpots: 0,
        surfaceSpotIds: [],
        operatingHours: { start: '', end: '' },
        activeDays: [],
        maxQueueSize: 0,
        avgRetrievalTimeMinutes: 0,
        updatedAt: currentTime, // 👈 זמן חדש גם באיפוס!
        updatedBy: 'admin'
      } : null);
    
      setSystemSettings(prev => prev ? {
        ...prev,
        maintenance_mode: false,
        show_admin_analytics: false,
        updatedAt: currentTime, // 👈 זמן חדש גם באיפוס!
        updatedBy: 'admin'
      } : null);
    
      setRawSpotsText('');
      setIsProcessing(false);
      setNewSpotId('');
      setShowAddSpot(false);
    
      console.log('🗑️ Data cleared, time updated to:', currentTime.toLocaleString());
    }
  };

  // אם תרצה עיבוד רק על מקשים (ללא טיימר כלל):

  const handleSpotsInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRawSpotsText(value); // רק שמירת הטקסט, ללא עיבוד
    
    // הצגת אינדיקטור שיש שינויים לא שמורים
    setIsProcessing(true);
  };

  const handleSpotsKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // מנע שורה חדשה
      processAndUpdate();
    }
    
    if (e.key === 'Tab') {
      processAndUpdate();
    }
    
    // Ctrl+S לשמירה מהירה
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      processAndUpdate();
    }
  };

  const processAndUpdate = () => {
    // בטל טיימרים קיימים
    if (processingTimeout) {
      clearTimeout(processingTimeout);
      setProcessingTimeout(null);
    }
    
    // עיבוד מיידי
    processSpotText(rawSpotsText);
    setIsProcessing(false);
  };

  const processSpotText = (text: string) => {
    if (text.trim() === '') {
      setParkingConfig(prev => prev ? {
        ...prev,
        surfaceSpotIds: [],
        totalSurfaceSpots: 0
        // 👈 הסר את updatedAt מכאן!
      } : null);
      return;
    }
    
    const spots = text
      .split(/[,\n\s]+/)
      .map(spot => spot.trim())
      .filter(spot => spot.length > 0);
    
    const uniqueSpots = Array.from(new Set(spots));
    
    setParkingConfig(prev => prev ? {
      ...prev,
      surfaceSpotIds: uniqueSpots,
      totalSurfaceSpots: uniqueSpots.length
      // 👈 הסר את updatedAt מכאן!
    } : null);
    
    // console.log('🚗 Spots updated, time updated to:', new Date().toLocaleString());
  };

  const handleSpotsBlur = () => {
    // עיבוד מיידי בעזיבת השדה (ביטול ההשהיה)
    if (processingTimeout) {
      clearTimeout(processingTimeout);
      setProcessingTimeout(null);
    }
    processSpotText(rawSpotsText);
  };

  // אם תרצה עיבוד רק על מקשים מסוימים:
  

  useEffect(() => {
    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [processingTimeout]);

  // הוסף את הפונקציות האלה לפני return:

  // הוספת חניה חדשה
  const addNewSpot = () => {
    const spotId = newSpotId.trim();
    
    if (!spotId) {
      return;
    }
    
    const existingSpots = parkingConfig?.surfaceSpotIds || [];
    
    // 👈 הוסף בדיקת מגבלה כאן!
    console.log('🔍 Checking limit:', existingSpots.length, 'vs', maxSpotsLimit);
    
    if (existingSpots.length >= maxSpotsLimit) {
      alert(`❌ Maximum limit reached! Cannot add more than ${maxSpotsLimit} parking spots.`);
      setNewSpotId('');
      setShowAddSpot(false);
      return;
    }
    
    // בדוק אם החניה כבר קיימת
    if (existingSpots.includes(spotId)) {
      alert(`Parking spot "${spotId}" already exists!`);
      setNewSpotId('');
      return; // לא סוגר את הטופס במקרה של שגיאה
    }
    
    // הוסף את החניה
    setParkingConfig(prev => prev ? {
      ...prev,
      surfaceSpotIds: [...existingSpots, spotId],
      totalSurfaceSpots: existingSpots.length + 1
    } : null);
    
    setNewSpotId('');
    setShowAddSpot(false);
    
    console.log(`✅ Added parking spot: ${spotId} (${existingSpots.length + 1}/${maxSpotsLimit})`);
  };

  // הסרת חניה
  const removeSpot = (indexToRemove: number) => {
    const existingSpots = parkingConfig?.surfaceSpotIds || [];
    const spotToRemove = existingSpots[indexToRemove];
    
    if (window.confirm(`Remove parking spot "${spotToRemove}"?`)) {
      const newSpots = existingSpots.filter((_, index) => index !== indexToRemove);
      
      setParkingConfig(prev => prev ? {
        ...prev,
        surfaceSpotIds: newSpots,
        totalSurfaceSpots: newSpots.length
        // 👈 הסר את updatedAt מכאן!
      } : null);
      
      console.log(`🗑️ Removed parking spot: ${spotToRemove}`);
    }
  };

  // טיפול במקשים בשדה החניה החדשה
  const handleNewSpotKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewSpot();
      
      // 👈 הוסף זה - סגור את הטופס אחרי הוספה!
      setShowAddSpot(false);
    }
    
    if (e.key === 'Escape') {
      setNewSpotId('');
      setShowAddSpot(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!parkingConfig || !systemSettings) return <div>Error loading configuration</div>;

  return (
    <div className="admin-config container glass-effect">
      <h1>Parking System Configuration</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="config-grid">
        {/* Facility Info */}
        <div className="config-section">
          <h2>1. Facility Information</h2>
          <div className="form-group">
            <label>Facility Name:</label>
            <input
              type="text"
              placeholder="Enter facility name (e.g., Main Parking Center)"
              value={parkingConfig.facilityName}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                facilityName: e.target.value
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Lot ID:</label>
            <input
              type="text"
              placeholder="Enter unique lot ID (e.g., main-lot-001)"
              value={parkingConfig.id}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                id: e.target.value
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Timezone:</label>
            <select
              value={parkingConfig.timezone}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                timezone: e.target.value
                // 👈 ללא updatedAt!
              }))}
            >
              <option value="Asia/Jerusalem">Asia/Jerusalem</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
        </div>

        {/* Parking Settings */}
        <div className="config-section">
          <h2>2. Parking Settings</h2>
          <div className="form-group">
            <label>Surface Spots Configuration:</label>
            
            <div className="spots-management">
              {/* כפתור הוספת חניה */}
              <button 
                type="button"
                className="add-spot-btn"
                onClick={() => setShowAddSpot(true)}
              >
                + Add New Parking Spot
              </button>

              {/* שדה הוספת חניה חדשה */}
              {showAddSpot && (
                <div className="add-spot-container">
                  <input
                    type="text"
                    placeholder="Enter parking spot ID (e.g., S1, A-01, VIP-Premium)"
                    value={newSpotId}
                    onChange={(e) => setNewSpotId(e.target.value)}
                    onKeyDown={handleNewSpotKeyDown}
                    onBlur={() => {
                      if (!newSpotId.trim()) {
                        setShowAddSpot(false);
                      }
                    }}
                    autoFocus
                    className="new-spot-input"
                  />
                </div>
              )}

              {/* רשימת החניות הקיימות */}
              <div className="existing-spots">
                <div className="spots-header">
                  <strong>
                    Existing Spots ({parkingConfig.surfaceSpotIds?.length || 0} total)
                  </strong>
                </div>
                
                <div className="spots-list">
                  {parkingConfig.surfaceSpotIds && parkingConfig.surfaceSpotIds.length > 0 ? (
                    parkingConfig.surfaceSpotIds.map((spot, index) => {
                      // זיהוי סוג החניה לעיצוב מיוחד
                      let spotType = 'regular';
                      if (spot.toLowerCase().includes('vip')) spotType = 'vip';
                      else if (spot.toLowerCase().includes('handicap')) spotType = 'handicap';
                      else if (spot.toLowerCase().includes('premium')) spotType = 'premium';
                      
                      return (
                        <div key={index} className="spot-item">
                          <span 
                            className="spot-tag"
                            data-type={spotType}
                            title={`Parking spot: ${spot}`}
                          >
                            {spot}
                          </span>
                          <button 
                            className="remove-spot-btn"
                            onClick={() => removeSpot(index)}
                            title="Remove this spot"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-spots">
                      No parking spots added yet. Click + to add your first spot.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="config-section">
          <h2>3. Operating Hours</h2>
          <div className="form-group">
            <label>Opening Hour (HH:mm):</label>
            <input
              type="time"
              value={parkingConfig.operatingHours.start}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                operatingHours: { ...prev!.operatingHours, start: e.target.value }
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Closing Hour (HH:mm):</label>
            <input
              type="time"
              value={parkingConfig.operatingHours.end}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                operatingHours: { ...prev!.operatingHours, end: e.target.value }
                // 👈 ללא updatedAt!
              }))}
            />
          </div>

          <div className="form-group">
            <label>Active Days:</label>
            <div className="days-selector">
              {[
                { key: 'sunday', label: 'Sunday' },
                { key: 'monday', label: 'Monday' },
                { key: 'tuesday', label: 'Tuesday' },
                { key: 'wednesday', label: 'Wednesday' },
                { key: 'thursday', label: 'Thursday' },
                { key: 'friday', label: 'Friday' }
              ].map(day => (
                <label key={day.key} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={parkingConfig.activeDays?.includes(day.key) || false}
                    onChange={(e) => {
                      const currentDays = parkingConfig.activeDays || [];
                      const newActiveDays = e.target.checked
                        ? [...currentDays, day.key]
                        : currentDays.filter(d => d !== day.key);
                      
                      setParkingConfig(prev => ({
                        ...prev!,
                        activeDays: newActiveDays
                        // 👈 ללא updatedAt!
                      }));
                    }}
                  />
                  <span className="day-label">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Queue & Retrieval Management */}
        <div className="config-section">
          <h2>4. Queue & Retrieval Management</h2>
          <div className="form-group">
            <label>Max Queue Size:</label>
            <input
              type="number"
              min="0"
              value={parkingConfig.maxQueueSize}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                maxQueueSize: parseInt(e.target.value)
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Average Retrieval Time (minutes):</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={parkingConfig.avgRetrievalTimeMinutes}
              onChange={(e) => setParkingConfig(prev => ({
                ...prev!,
                avgRetrievalTimeMinutes: parseFloat(e.target.value)
              }))}
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="config-section">
          <h2>5. System Settings</h2>
          <div className="form-group">
            <label>Maintenance Mode:</label>
            <input
              type="checkbox"
              checked={systemSettings.maintenance_mode}
              onChange={(e) => setSystemSettings(prev => ({
                ...prev!,
                maintenance_mode: e.target.checked
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Show Admin Analytics:</label>
            <input
              type="checkbox"
              checked={systemSettings.show_admin_analytics}
              onChange={(e) => setSystemSettings(prev => ({
                ...prev!,
                show_admin_analytics: e.target.checked
                // 👈 ללא updatedAt!
              }))}
            />
          </div>
        </div>
      </div>

      {/* כפתור שמירה ואיפוס */}
      <div className="actions-container">
        <button 
          className="save-btn"
          onClick={saveConfig}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        
        <button 
          className="reset-btn"
          onClick={resetToDefaults}
          disabled={saving}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
