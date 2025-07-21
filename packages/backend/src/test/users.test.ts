import request from 'supertest';
import app from '../services/app'; 

describe('GET /api/users', () => {
    let userId: string;
     
  beforeEach(async () => {
    const result = await db.one(
      `INSERT INTO users (email, first_name, last_name, status, created_at, updated_at, created_by, department, role)
       VALUES ('test.user@example.com', 'Test', 'User', 'approved', NOW(), NOW(), 'admin', 'Engineering', 'user') 
       RETURNING id`
    );
    userId = result.id; 
  });

  afterEach(async () => {
    await db.none(`DELETE FROM users WHERE id = $1`, [userId]);
  });


  it('should return all users if no filters are applied', async () => {

    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3); 
  });

  it('should return users filtered by role "admin"', async () => {
    const response = await request(app).get('/api/users?role=admin');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);  
    expect(response.body[0].role).toBe('admin');
  });

  it('should return users filtered by role "hr"', async () => {
    const response = await request(app).get('/api/users?role=hr');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); 
    expect(response.body[0].role).toBe('hr');
  });

  it('should return users filtered by role "user"', async () => {
    const response = await request(app).get('/api/users?role=user');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);  
    expect(response.body[0].role).toBe('user');
    expect(response.body[1].role).toBe('user');
  });

    it('should return 400 for invalid role "aaa"', async () => {
    const response = await request(app).get('/api/users?role=aaa');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid role filter');
  });

  it('should return an empty array if no users match the role filter', async () => {
    const response = await request(app).get('/api/users?role=manager');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0); 
  });

});




describe('POST /api/users', () => {
  
  let userId: string;
  beforeEach(async () => {
    const result = await db.one(
      `INSERT INTO users (email, first_name, last_name, status, created_at, updated_at, created_by, department, role)
       VALUES ('test.user@example.com', 'Test', 'User', 'approved', NOW(), NOW(), 'admin', 'Engineering', 'user') 
       RETURNING id`
    );
    userId = result.id;
  });

  
  afterEach(async () => {
    await db.none(`DELETE FROM users WHERE id = $1`, [userId]);
  });

  it('should retrieve the created user by ID', async () => {
  
    const response = await request(app)
    .get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe("Test");
    expect(response.body.status).toBe("approved");
    expect(response.body.department).toBe("Engineering");
  });

  

  it('should return 400 if required fields are missing', async () => {
    const newUser = {
      firstName: 'Missing',
      lastName: 'Email',
      status: 'approved',
      createdBy: 'admin',
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });
});





describe('PUT /api/users/:id', () => {
    
  let userId: string;
     
  beforeEach(async () => {
    const result = await db.one(
      `INSERT INTO users (email, first_name, last_name, status, created_at, updated_at, created_by, department, role)
       VALUES ('test.user@example.com', 'Test', 'User', 'approved', NOW(), NOW(), 'admin', 'Engineering', 'user') 
       RETURNING id`
    );
    userId = result.id; 
  });

  
  afterEach(async () => {
    await db.none(`DELETE FROM users WHERE id = $1`, [userId]);
  });


  it('should update a user successfully', async () => {
    const updatedUser = {
      status: 'approved',
      department: 'Marketing'
    };

    const response = await request(app)
      .put(`/api/users/${userId}`) 
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(updatedUser.status);
    expect(response.body.department).toBe(updatedUser.department);
  });

  it('should return 400 if trying to update with invalid data', async () => {
    const updatedUser = {
      status: 'unknownStatus',
      department: 'HR'
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(response.status).toBe(400); 
    expect(response.body.error).toBe('Invalid status value');
  });
  it('should return 200 if no update is made (same data)', async () => {
  const updatedUser = {
    status: 'approved',
    department: 'Engineering', 
    role: 'user',
  };

  const response = await request(app)
    .put(`/api/users/${userId}`)
    .send(updatedUser);

  expect(response.status).toBe(200); 
  expect(response.body.status).toBe('approved');
  expect(response.body.department).toBe('Engineering');
  expect(response.body.role).toBe('user');
});

});




describe('DELETE /api/users/:id', () => {
  let userId: string;
     
  beforeEach(async () => {
    const result = await db.one(
      `INSERT INTO users (email, first_name, last_name, status, created_at, updated_at, created_by, department, role)
       VALUES ('test.user@example.com', 'Test', 'User', 'approved', NOW(), NOW(), 'admin', 'Engineering', 'user') 
       RETURNING id`
    );
    userId = result.id; 
  });

 
  afterEach(async () => {
    await db.none(`DELETE FROM users WHERE id = $1`, [userId]);
  });


  it('should delete a user successfully', async () => {

    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204); 
  });

  it('should return 404 if the user does not exist', async () => {
    const response = await request(app).get('/api/users/999'); 
    // const response = await request(app).delete('/api/users/999'); 
    expect(response.status).toBe(404);  
    expect(response.body.error).toBe('User not found');
  });
});