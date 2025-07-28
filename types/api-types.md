# API Request/Response Types

## Authentication & Authorization

```typescript
// Google OAuth (for Employees)
interface GoogleAuthRequest {
  code: string;
  redirect_uri: string;
}

interface GoogleAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: Date;
  status: 'pending_approval' | 'approved' | 'declined';
}

// Username/Password Auth (for HR/Admin)
interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'hr' | 'admin';
    permissions: string[];
  };
  token: string;
  expiresAt: Date;
}

interface TokenRefreshRequest {
  refreshToken: string;
}

interface TokenRefreshResponse {
  token: string;
  expiresAt: Date;
}
```

## HR Dashboard APIs

```typescript
// User Management
interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  department?: string;
  employeeId?: string;
  maxCarsAllowedParking?: number;
  sendInviteEmail?: boolean;
}

interface CreateUserResponse {
  user: User;
  inviteLink?: string;
}

interface BulkCreateUsersRequest {
  users: Omit<CreateUserRequest, 'sendInviteEmail'>[];
  sendInviteEmails: boolean;
}

interface BulkCreateUsersResponse {
  created: User[];
  failed: {
    email: string;
    error: string;
  }[];
  inviteLinks?: Record<string, string>; // email -> invite link
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  employeeId?: string;
  maxCarsAllowedParking?: number;
  status?: 'approved' | 'declined' | 'suspended';
}

interface GetUsersRequest {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'declined' | 'suspended';
  department?: string;
  search?: string;
}

interface GetUsersResponse {
  users: (User & {
    vehicleCount: number;
    currentlyParkedCount: number;
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Vehicle Management
interface CreateVehicleRequest {
  userId: string;
  licensePlate: string;
  vehicleModelId?: string;
  color?: string;
  dimensionOverrides?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
}

interface CreateVehicleResponse {
  vehicle: Vehicle;
  effectiveDimensions: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  dimensionsSource: 'model_reference' | 'manual_override' | 'government_db';
}

// Vehicle Model Management
interface CreateVehicleModelRequest {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  dimensions: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
}

interface GetVehicleModelsRequest {
  make?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface GetVehicleModelsResponse {
  models: VehicleModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Unknown Model Management
interface GetUnknownModelsResponse {
  unknownModels: (UnknownVehicleModel & {
    suggestedDimensions?: {
      height: number;
      width: number;
      length: number;
      weight: number;
    };
  })[];
}

interface ResolveUnknownModelRequest {
  unknownModelId: string;
  action: 'create_model' | 'ignore';
  vehicleModelData?: CreateVehicleModelRequest;
}

interface ResolveUnknownModelResponse {
  success: boolean;
  createdModel?: VehicleModel;
  affectedVehicleCount: number;
}
```

## Admin Dashboard APIs

```typescript
// User Approval
interface PendingUsersResponse {
  users: (User & {
    registrationDate: Date;
    vehicleCount: number;
  })[];
}

interface ApproveUserRequest {
  userId: string;
  approved: boolean;
  reason?: string;
  maxCarsAllowedParking?: number;
}

interface ApproveUserResponse {
  user: User;
  notificationSent: boolean;
}

interface BulkApproveUsersRequest {
  userIds: string[];
  approved: boolean;
  reason?: string;
}

// System Monitoring
interface SystemHealthResponse {
  overall: 'healthy' | 'warning' | 'error';
  components: SystemHealth[];
  lastUpdated: Date;
}

interface SystemMetricsResponse {
  users: {
    total: number;
    active: number;
    pending: number;
  };
  vehicles: {
    total: number;
    active: number;
    currentlyParked: number;
  };
  parking: {
    availableSurfaceSpots: number;
    queueLength: number;
    avgRetrievalTime: number;
  };
  lastHourActivity: {
    entries: number;
    exits: number;
    retrievalRequests: number;
  };
}

// Analytics
interface GetAnalyticsRequest {
  startDate: Date;
  endDate: Date;
  groupBy: 'hour' | 'day' | 'week';
}

interface GetAnalyticsResponse {
  usageStats: {
    period: Date;
    totalSessions: number;
    avgParkingDuration: number;
    avgRetrievalTime: number;
    peakUsage: number;
  }[];
  summary: {
    totalSessions: number;
    avgUtilization: number;
    bustiestHour: string;
    busiestDay: string;
  };
}

// User Management
interface AdminGetUsersRequest {
  page?: number;
  limit?: number;
  status?: string;
  role?: 'user' | 'admin';
  search?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email';
  sortOrder?: 'asc' | 'desc';
}

interface UpdateUserPermissionsRequest {
  userId: string;
  permissions: string[];
  reason?: string;
}
```

## Mobile App APIs

```typescript
// User Profile
interface GetProfileResponse {
  user: User;
  vehicles: (Vehicle & {
    effectiveDimensions: {
      height: number;
      width: number;
      length: number;
      weight: number;
    };
    model?: VehicleModel;
  })[];
  currentSession?: ParkingSession;
  stats: {
    totalParkingSessions: number;
    avgParkingDuration: number;
    favoriteArrivalTime: string;
    favoriteDay: string;
  };
}

interface AddVehicleRequest {
  licensePlate: string;
  vehicleModelId?: string;
  color?: string;
  dimensionOverrides?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
}

interface UpdateVehicleRequest {
  vehicleId: string;
  vehicleModelId?: string;
  color?: string;
  isActive?: boolean;
  dimensionOverrides?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
}

// Parking Operations
interface CheckParkingStatusResponse {
  hasParkedVehicle: boolean;
  session?: ParkingSession & {
    vehicle: Vehicle;
    queueInfo?: {
      position: number;
      estimatedTime: Date;
      status: 'queued' | 'processing' | 'ready';
    };
  };
  availableSpots: number;
  canParkMore: boolean;
  currentlyParkedCount: number;
  maxAllowed: number;
}

interface RequestRetrievalRequest {
  licensePlate?: string; // optional if user has only one car parked
}

interface RequestRetrievalResponse {
  queuePosition: number;
  estimatedTime: Date;
  retrievalId: string;
  currentQueueLength: number;
  pickupInstructions: string;
}

interface GetRetrievalStatusResponse {
  status: 'queued' | 'processing' | 'ready' | 'completed';
  queuePosition: number;
  estimatedTime: Date;
  pickupSpot?: string;
  timeRemaining: number; // minutes
  message?: string;
}

// Analytics for Users
interface GetUserAnalyticsRequest {
  period: 'week' | 'month' | 'quarter';
  vehicleId?: string;
}

interface GetUserAnalyticsResponse {
  period: {
    start: Date;
    end: Date;
  };
  sessions: number;
  totalDuration: number; // minutes
  avgDuration: number; // minutes
  avgRetrievalTime: number; // minutes
  busyHours: {
    hour: number;
    sessions: number;
  }[];
  busyDays: {
    dayOfWeek: number;
    sessions: number;
  }[];
  recommendations: {
    bestArrivalTime: string;
    bestDepartureTime: string;
    leastBusyDay: string;
  };
}
```

## Tablet Interface APIs

```typescript
interface TabletLookupRequest {
  licensePlate: string;
}

interface TabletLookupResponse {
  found: boolean;
  vehicle?: Vehicle & {
    user: {
      firstName: string;
      lastName: string;
    };
    effectiveDimensions: {
      height: number;
      width: number;
      length: number;
      weight: number;
    };
  };
  canRetrieve: boolean;
  reason?: string; // if cannot retrieve
}

interface TabletRetrievalRequest {
  licensePlate: string;
}

interface TabletRetrievalResponse {
  success: boolean;
  queuePosition: number;
  estimatedTime: Date;
  retrievalId: string;
  pickupInstructions: string;
  error?: string;
}

interface GetCurrentQueueResponse {
  queue: {
    position: number;
    licensePlate: string;
    estimatedTime: Date;
    status: 'queued' | 'processing' | 'ready';
    timeInQueue: number; // minutes
  }[];
  avgProcessingTime: number;
  systemStatus: 'operational' | 'maintenance' | 'error';
}
```

## OPC Bridge Communication APIs

```typescript
// From OPC Bridge to Main System
interface VehicleLookupRequest {
  licensePlate: string;
  timestamp: Date;
  opcRequestId: string;
}

interface VehicleLookupResponse {
  found: boolean;
  vehicleDetails?: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  userId?: string;
  approved: boolean;
  error?: string;
}

interface StoreLocationRequest {
  licensePlate: string;
  undergroundSpot: string;
  surfaceSpot: string;
  timestamp: Date;
  opcRequestId: string;
}

interface StoreLocationResponse {
  sessionId: string;
  success: boolean;
  error?: string;
}

interface RetrievalStatusRequest {
  undergroundSpot: string;
  timestamp: Date;
}

interface RetrievalStatusResponse {
  queuePosition: number;
  estimatedTime: Date;
  surfaceSpot?: string;
  retrievalId: string;
  status: 'queued' | 'processing' | 'ready';
}

interface QueueUpdateRequest {
  updates: {
    retrievalId: string;
    queuePosition: number;
    estimatedTime: Date;
    status: 'queued' | 'processing' | 'ready' | 'completed';
    surfaceSpot?: string;
  }[];
  timestamp: Date;
}

interface QueueUpdateResponse {
  processed: number;
  errors?: string[];
}

// From Main System to OPC Bridge
interface InitiateRetrievalRequest {
  undergroundSpot: string;
  retrievalId: string;
  priority: 'normal' | 'urgent';
}

interface InitiateRetrievalResponse {
  accepted: boolean;
  queuePosition: number;
  estimatedTime: Date;
  error?: string;
}
```

## Government Database Integration

```typescript
interface GovernmentDataSyncRequest {
  forceSync?: boolean;
  dataSource: 'data_gov_il' | 'manual_upload';
  filePath?: string;
}

interface GovernmentDataSyncResponse {
  syncId: string;
  status: 'started' | 'completed' | 'failed';
  recordsProcessed?: number;
  recordsAdded?: number;
  recordsUpdated?: number;
  errors?: string[];
  startedAt: Date;
  completedAt?: Date;
}

interface GovernmentLookupRequest {
  licensePlate: string;
}

interface GovernmentLookupResponse {
  found: boolean;
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    dimensions?: {
      height: number;
      width: number;
      length: number;
      weight: number;
    };
  };
  source: 'government_db' | 'vehicle_model' | 'fallback';
}
```

## WebSocket Events

```typescript
interface WebSocketEvent {
  type: 'queue_update' | 'retrieval_ready' | 'system_alert' | 'parking_status';
  timestamp: Date;
  data: any;
}

interface QueueUpdateEvent extends WebSocketEvent {
  type: 'queue_update';
  data: {
    retrievalId: string;
    queuePosition: number;
    estimatedTime: Date;
    timeRemaining: number;
    status: 'queued' | 'processing' | 'ready';
  };
}

interface RetrievalReadyEvent extends WebSocketEvent {
  type: 'retrieval_ready';
  data: {
    retrievalId: string;
    pickupSpot: string;
    licensePlate: string;
    message: string;
    instructions: string;
  };
}

interface ParkingStatusEvent extends WebSocketEvent {
  type: 'parking_status';
  data: {
    availableSpots: number;
    queueLength: number;
    avgWaitTime: number;
    systemStatus: 'operational' | 'maintenance' | 'error';
  };
}

interface SystemAlertEvent extends WebSocketEvent {
  type: 'system_alert';
  data: {
    level: 'info' | 'warning' | 'error';
    message: string;
    affectedComponents: string[];
    timestamp: Date;
  };
}
```

## Common Response Types

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
}

interface BulkOperationResponse<T> {
  successful: T[];
  failed: {
    item: any;
    error: string;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
```

## Error Response Types

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: Date;
  };
}

// Common Error Codes
type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN' 
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'VEHICLE_NOT_FOUND'
  | 'USER_NOT_APPROVED'
  | 'PARKING_LIMIT_EXCEEDED'
  | 'ALREADY_PARKED'
  | 'NOT_PARKED'
  | 'QUEUE_FULL'
  | 'OPC_CONNECTION_ERROR'
  | 'OPC_OPERATION_FAILED'
  | 'GOVERNMENT_API_ERROR'
  | 'UNKNOWN_VEHICLE_MODEL'
  | 'INVALID_LICENSE_PLATE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SYSTEM_MAINTENANCE';

interface ValidationErrorDetails {
  field: string;
  message: string;
  value?: any;
}
```