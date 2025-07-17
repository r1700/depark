# Entity Types Definition

## User Management

```typescript
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

 export interface User extends BaseUser {
  department?: string;
  employeeId?: string;
  googleId?: string;
  status: 'pending' | 'approved' | 'declined' | 'suspended';
  maxCarsAllowedParking?: number; // optional, uses system default if not set
  createdBy: string; // Admin user ID
  approvedBy?: string; // Admin user ID
  approvedAt?: Date;
}

 export interface AdminUser extends BaseUser {
  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: Date;
}
```

## Vehicle Management

```typescript
interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  vehicleModelId?: string; // reference to VehicleModel, optional
  color?: string;
  isActive: boolean;
  isCurrentlyParked: boolean;
  createdAt: Date;
  updatedAt: Date;
  addedBy: 'user' | 'hr';
  
  // Override dimensions (for manual entry or corrections)
  dimensionOverrides?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
  dimensionsSource: 'model_reference' | 'manual_override' | 'government_db';
}

interface VehicleModel {
  id: string;
  make: string;
  model: string;
  yearRange: {
    start: number;
    end: number;
  };
  dimensions: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  source: 'manual' | 'government_db' | 'hr_input';
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string; // Admin user who updated unknown model
}

interface UnknownVehicleModel {
  id: string;
  make: string;
  model: string;
  requestCount: number; // how many times this unknown model was requested
  lastRequested: Date;
  status: 'pending_review' | 'resolved' | 'ignored';
  resolvedBy?: string; // Admin user ID
  resolvedAt?: Date;
  resolvedVehicleModelId?: string; // when resolved, points to the created VehicleModel
  createdAt: Date;
}
```

## Parking System

```typescript
interface ParkingSpot {
  id: string;
  type: 'surface' | 'underground';
  spotNumber: string;
  isOccupied: boolean;
  currentVehicleId?: string;
  lastUpdated: Date;
}

interface ParkingSession {
  id: string;
  userId: string;
  vehicleId: string;
  licensePlate: string;
  surfaceSpot?: string; // assigned surface spot (1-6)
  undergroundSpot?: string; // where car is stored underground
  status: 'parked' | 'retrieval_requested' | 'completed';
  entryTime: Date;
  exitTime?: Date;
  retrievalRequestTime?: Date;
  actualRetrievalTime?: Date;
  pickupSpot?: string; // surface spot for pickup
  requestedBy?: 'mobile' | 'tablet'; // where retrieval was requested from
}

interface RetrievalQueue {
  id: string;
  sessionId: string;
  userId?: string; // null if requested from tablet
  licensePlate: string;
  undergroundSpot: string;
  requestedAt: Date;
  estimatedTime: Date;
  position: number;
  status: 'queued' | 'processing' | 'ready' | 'completed';
  assignedPickupSpot?: string;
  requestSource: 'mobile' | 'tablet';
}
```

## System Configuration

```typescript
interface ParkingConfiguration {
  id: string;
  facilityName: string;
  totalSurfaceSpots: number;
  surfaceSpotIds: string[]; // configurable spot identifiers (1-6 by default)
  avgRetrievalTimeMinutes: number; // default 1 minute
  maxQueueSize: number;
  operatingHours: {
    start: string; // "07:00"
    end: string; // "19:00"
  };
  timezone: string;
  updatedAt: Date;
  updatedBy: string;
}

interface SystemSettings {
  id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  category: 'parking' | 'auth' | 'notifications' | 'integration' | 'government_db';
  updatedAt: Date;
  updatedBy: string;
}

interface GovernmentDataSync {
  id: string;
  syncDate: Date;
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  errors: string[];
  status: 'completed' | 'failed' | 'partial';
  triggeredBy: string; // admin user ID
  fileSource?: string; // path to downloaded file
}
```

## Analytics & Monitoring

```typescript
interface ParkingUsageStats {
  id: string;
  date: Date;
  hour: number;
  totalParkedCars: number;
  avgRetrievalTime: number;
  maxQueueLength: number;
  peakUsageTime: string;
  utilizationPercentage: number;
  totalEntries: number;
  totalExits: number;
}

interface UserActivity {
  id: string;
  userId?: string;
  userType: 'hr' | 'admin' | 'employee' | 'anonymous'; // anonymous for tablet usage
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

interface SystemHealth {
  id: string;
  component: 'opc_bridge' | 'api_server' | 'database' | 'websocket_server' | 'government_sync';
  status: 'healthy' | 'warning' | 'error';
  message?: string;
  metrics?: Record<string, number>;
  timestamp: Date;
}
```

## Communication & Notifications

```typescript
interface WebSocketConnection {
  id: string;
  userId?: string; // null for tablet connections
  connectionType: 'mobile' | 'tablet';
  isActive: boolean;
  connectedAt: Date;
  lastActivity: Date;
  ipAddress: string;
}

interface QueueUpdate {
  id: string;
  retrievalQueueId: string;
  position: number;
  estimatedTime: Date;
  status: 'queued' | 'processing' | 'ready';
  message?: string;
  timestamp: Date;
  broadcastTo: 'specific_user' | 'all_tablets' | 'all_connected';
}

interface NotificationLog {
  id: string;
  userId?: string;
  type: 'queue_update' | 'retrieval_ready' | 'parking_full' | 'system_maintenance';
  channel: 'websocket' | 'push_notification';
  message: string;
  delivered: boolean;
  deliveredAt?: Date;
  error?: string;
  timestamp: Date;
}
```

## OPC Bridge Integration

```typescript
interface BridgeRequest {
  id: string;
  type: 'vehicle_lookup' | 'store_location' | 'retrieval_request' | 'queue_status';
  payload: Record<string, any>;
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
  sentAt: Date;
  acknowledgedAt?: Date;
  response?: Record<string, any>;
  retryCount: number;
  maxRetries: number;
  error?: string;
}

interface OPCSystemStatus {
  id: string;
  isConnected: boolean;
  lastHeartbeat: Date;
  availableSurfaceSpots: number;
  queueLength: number;
  systemErrors: string[];
  performanceMetrics: {
    avgRetrievalTime: number;
    successfulRetrievals: number;
    failedOperations: number;
  };
  timestamp: Date;
}
```

## Authentication & Sessions

```typescript
interface UserSession {
  id: string;
  userId: string;
  userType: 'user' | 'admin';
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
}

interface GoogleAuthState {
  id: string;
  state: string;
  userId?: string; // set after successful auth
  email: string;
  firstName: string;
  lastName: string;
  status: 'pending' | 'approved' | 'declined';
  expiresAt: Date;
  createdAt: Date;
}

interface LoginAttempt {
  id: string;
  email: string;
  userType: 'user' | 'admin';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
  timestamp: Date;
}
```

## Reporting & Analytics

```typescript
interface UsageReport {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  generatedBy: string; // user ID
  data: {
    totalSessions: number;
    avgParkingDuration: number;
    avgRetrievalTime: number;
    peakHours: { hour: number; sessions: number }[];
    utilizationRate: number;
    userStats: { userId: string; sessionCount: number }[];
  };
  format: 'json' | 'csv' | 'pdf';
  filePath?: string;
  generatedAt: Date;
}

interface VehicleReport {
  id: string;
  totalVehicles: number;
  activeVehicles: number;
  unknownModels: number;
  dimensionSources: {
    manual: number;
    government_db: number;
    model_default: number;
  };
  topMakes: { make: string; count: number }[];
  generatedBy: string;
  generatedAt: Date;
}
```