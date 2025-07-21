import Joi from 'joi';

export interface GoogleAuthState {
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

export class GoogleAuthStateModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    state: Joi.string().required(),
    userId: Joi.string().optional(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    status: Joi.string().valid('pending', 'approved', 'declined').required(),
    expiresAt: Joi.date().required(),
    createdAt: Joi.date().required()
  });

  constructor(
    public id: string,
    public state: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public status: 'pending' | 'approved' | 'declined',
    public expiresAt: Date,
    public createdAt: Date,
    public userId?: string
  ) {}

  static create(data: any): Promise<GoogleAuthStateModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new GoogleAuthStateModel(
      value.id,
      value.state,
      value.email,
      value.firstName,
      value.lastName,
      value.status,
      new Date(value.expiresAt),
      new Date(value.createdAt),
      value.userId
    ));
  }
}

// Example usage of GoogleAuthStateModel

const googleAuthStateData = {
  id: "auth123",
  state: "initial",
  userId: "user456",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  status: "pending",
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  createdAt: new Date()
};

GoogleAuthStateModel.create(googleAuthStateData)
  .then(googleAuthState => {
    console.log("Google Auth State created successfully:", googleAuthState);
  })
  .catch(error => {
    console.error("Error creating Google Auth State:", error);
  });
